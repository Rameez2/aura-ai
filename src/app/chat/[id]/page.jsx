'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ChatbotPublicPage() {
  const params = useParams()
  // Ensure we stringify or cleanly extract to break object identity shifting
  const chatbotId = params?.id 
  const supabase = createClient()

  // Functional Interface States
  const [chatbot, setChatbot] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [pageError, setPageError] = useState(null)

  // Scroll anchor reference
  const messagesEndRef = useRef(null)

  // Automatically keep message layout focused at the absolute bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initial Fetch: Load Chatbot Identity Configuration
  useEffect(() => {
    // CRITICAL: Guard loop execution against empty or undefined initial parameter hits
    if (!chatbotId) return

    const fetchChatbotIdentity = async () => {
      try {
        const { data, error } = await supabase
          .from('chatbots')
          .select('name')
          .eq('id', chatbotId)
          .single()

        if (error || !data) {
          throw new Error('The requested conversational instance could not be resolved.')
        }

        setChatbot(data)
      } catch (err) {
        console.error('Core loading error:', err)
        setPageError(err.message)
      } finally {
        setPageLoading(false)
      }
    }

    fetchChatbotIdentity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbotId]) // ✅ Stable primitive tracking string string anchor bounds

  // Form Submission Handler: Process Prompts & Stream Completions
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userPayload = { role: 'user', content: input.trim() }
    const workingHistory = [...messages, userPayload]

    // Commit user message to state and clear input field
    setMessages(workingHistory)
    setInput('')
    setIsLoading(true)

    try {
      // Connect straight to your Edge AI pipeline gateway
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: workingHistory,
          chatbotId: chatbotId
        })
      })

      // ========================================================
      // BILLING GUARDRAIL INTERCEPT: TRAP PLAN FAILURE BOUNDS
      // ========================================================
      if (!response.ok) {
        const limitErrorExplanation = await response.text()
        
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            content: limitErrorExplanation || 'A communication fault occurred within the core language engine.'
          }
        ])
        setIsLoading(false)
        return
      }

      // ========================================================
      // LIVE TRANS-STREAM PROCESSING CORRIDOR
      // ========================================================
      const streamReader = response.body.getReader()
      const textDecoder = new TextDecoder()
      
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { value, done } = await streamReader.read()
        if (done) break

        const chunkText = textDecoder.decode(value, { stream: true })

        setMessages((prev) => {
          const adjustedHistory = [...prev]
          const activeIndex = adjustedHistory.length - 1
          adjustedHistory[activeIndex] = {
            ...adjustedHistory[activeIndex],
            content: adjustedHistory[activeIndex].content + chunkText
          }
          return adjustedHistory
        })
      }

    } catch (streamCrashErr) {
      console.error('Fatal streaming link failure:', streamCrashErr)
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: 'Connection timed out. Check your active infrastructure link.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle systemic entry state displays
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-neutral-800 border-t-neutral-300 rounded-full animate-spin" />
        <p className="text-[10px] text-neutral-500 font-mono tracking-widest">LOADING CONVERSATIONAL TERMINAL...</p>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-3">
          <p className="text-sm font-bold text-rose-400 font-mono uppercase tracking-wider">CRITICAL CORE ENVELOPE</p>
          <p className="text-xs text-neutral-400 font-sans">{pageError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800">
      {/* Upper Brand Nav Frame */}
      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <div>
            <h1 className="text-sm font-bold uppercase tracking-tight font-mono text-neutral-200">
              {chatbot?.name || 'AURA CONVERSATIONAL NODE'}
            </h1>
            <p className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase">SUPPORT AGENT ONLINE</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-neutral-950 border border-neutral-800 text-neutral-400 px-2.5 py-1 rounded">
          SECURE CLIENT CORRIDOR
        </span>
      </header>

      {/* Main Conversation Feed Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
            <p className="text-neutral-400 text-sm font-semibold">Welcome to our automated customer service hub.</p>
            <p className="text-neutral-600 text-xs max-w-xs">Ask anything. Our trained knowledge base agent will answer you directly from our official sources.</p>
          </div>
        )}

        {messages.map((msg, index) => {
          if (msg.role === 'system') {
            return (
              <div key={index} className="flex justify-center my-4">
                <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 max-w-xl text-xs font-mono text-rose-400 leading-relaxed space-y-1">
                  <p className="font-bold uppercase tracking-wider">⚠️ ACCOUNT NOTIFICATION:</p>
                  <p>{msg.content}</p>
                </div>
              </div>
            )
          }

          const isUser = msg.role === 'user'
          return (
            <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-neutral-100 text-neutral-950 font-medium rounded-tr-none'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none font-sans'
                }`}
              >
                {msg.content.split('\n').map((para, pIdx) => (
                  <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )
        })}

        {/* Loading Indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1.5 h-9">
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Form Bar */}
      <footer className="border-t border-neutral-900 p-4 bg-neutral-950 shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder={isLoading ? "Streaming computation processing..." : "Type your inquiry here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200 font-sans disabled:opacity-50 transition"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-neutral-100 text-neutral-950 hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-neutral-100 font-bold px-5 rounded-xl text-xs tracking-wider uppercase font-mono transition"
          >
            SEND
          </button>
        </form>
      </footer>
    </div>
  )
}