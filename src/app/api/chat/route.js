import { OpenAI } from 'openai'
import { createClient } from '@supabase/supabase-js'
import { getEncoding } from 'js-tiktoken'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const tokenizer = getEncoding('cl100k_base')

export async function POST(request) {
  try {
    const { messages, chatbotId } = await request.json()

    if (!messages || !chatbotId) {
      return new Response(JSON.stringify({ error: 'Missing core payload configuration' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ========================================================
    // PRE-FLIGHT GATEKEEPER: VERIFY MONTHLY ALLOCATION LIMITS
    // ========================================================

    // 1. Trace the chatbot to find its parent owner profile_id
    const { data: botData, error: botQueryError } = await supabaseAdmin
      .from('chatbots')
      .select('profile_id')
      .eq('id', chatbotId)
      .single()

    if (botQueryError || !botData) {
      return new Response(JSON.stringify({ error: 'Chatbot profile verification rejected' }), { status: 404 })
    }

    const profileId = botData.profile_id

    // 2. Fetch the user's specific live profile allowance metrics
    const { data: profilePlan, error: profilePlanError } = await supabaseAdmin
      .from('profiles')
      .select('plan_tier, token_allowance')
      .eq('id', profileId)
      .single()

    if (profilePlanError || !profilePlan) {
      return new Response(JSON.stringify({ error: 'Tenant profile validation failed' }), { status: 403 })
    }

    // 3. Fetch the sum of all tokens consumed by this profile during the current calendar month
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const { data: usageData, error: usageSumError } = await supabaseAdmin
      .from('usage_logs')
      .select('total_tokens')
      .eq('profile_id', profileId)
      .gte('created_at', firstDayOfMonth.toISOString())

    if (usageSumError) throw usageSumError

    const currentMonthlyUsage = usageData.reduce((sum, log) => sum + log.total_tokens, 0)

    // 4. Validate current usage against their specific dynamic database limit
    if (currentMonthlyUsage >= profilePlan.token_allowance) {
      return new Response(
        `Allocation Exceeded: Your assistant has reached its maximum monthly capacity for the ${profilePlan.plan_tier.toUpperCase()} plan. Please upgrade your subscription on the control dashboard to restore service instantly.`,
        { status: 403, headers: { 'Content-Type': 'text/plain' } }
      )
    }

    // ========================================================
    // SEMANTIC VECTOR SEARCH & RETRIEVAL (RAG)
    // ========================================================

    const lastUserMessage = messages[messages.length - 1].content

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: lastUserMessage.trim(),
    })
    const [{ embedding }] = embeddingResponse.data

    const { data: matchedChunks, error: matchError } = await supabaseAdmin.rpc(
      'match_document_chunks',
      {
        query_embedding: embedding,
        match_threshold: 0.2,
        match_count: 5,
        filter_chatbot_id: chatbotId,
      }
    )

    if (matchError) throw matchError

    const contextText = matchedChunks && matchedChunks.length > 0
      ? matchedChunks.map(chunk => chunk.content).join('\n\n')
      : "No verified knowledge base context available."

    const systemPromptContent = `You are an expert AI customer support agent.
Your responses must be derived strictly from the verified knowledge base context provided below.

[KNOWLEDGE BASE CONTEXT]:
${contextText}

Instructions:
- Answer professionally and concisely.
- If the answer is not contained in the context, state that you do not hold that information.`

    const systemPrompt = { role: 'system', content: systemPromptContent }
    const conversationalPayload = [systemPrompt, ...messages]

    // ========================================================
    // TOKEN ESTIMATION (INBOUND PROMPT MEASUREMENT)
    // ========================================================

    let incomingPayloadString = systemPromptContent
    for (const msg of messages) {
      incomingPayloadString += `\n${msg.role}: ${msg.content}`
    }
    const promptTokensCount = tokenizer.encode(incomingPayloadString).length

    // ========================================================
    // OPENAI COMPLETIONS STREAMING BRIDGE
    // ========================================================

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationalPayload,
      stream: true,
    })

    const encoder = new TextEncoder()
    
    const customReadableStream = new ReadableStream({
      async start(controller) {
        let accumulatedCompletionText = ''

        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            accumulatedCompletionText += content
            controller.enqueue(encoder.encode(content))
          }
        }

        controller.close()

        try {
          const completionTokensCount = tokenizer.encode(accumulatedCompletionText).length
          const totalTokensCount = promptTokensCount + completionTokensCount

          await supabaseAdmin
            .from('usage_logs')
            .insert({
              chatbot_id: chatbotId,
              profile_id: profileId,
              prompt_tokens: promptTokensCount,
              completion_tokens: completionTokensCount,
              total_tokens: totalTokensCount
            })
            
          console.log(`[Dynamic Guard] In: ${promptTokensCount} | Out: ${completionTokensCount} | Plan: ${profilePlan.plan_tier}`)
        } catch (dbLogErr) {
          console.error('Non-blocking metric logging crash:', dbLogErr)
        }
      },
    })

    return new Response(customReadableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Critical Architecture Chat Failure:', error)
    return new Response(JSON.stringify({ error: 'Internal Core Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}