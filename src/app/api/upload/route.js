import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { createClient } from '@supabase/supabase-js'
import PDFParser from 'pdf2json'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const chatbotId = formData.get('chatbotId')

    if (!file || !chatbotId) {
      return NextResponse.json({ error: 'Missing file or chatbot reference' }, { status: 400 })
    }

    // 1. Convert to buffer and push to Supabase Storage Bucket
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${chatbotId}/${Date.now()}.${fileExtension}`

    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('kb-documents')
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (storageError) throw storageError

    // 2. Log metadata entry in documents table
    const { data: docData, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        chatbot_id: chatbotId,
        name: file.name,
        type: file.type,
        storage_path: storageData.path
      })
      .select()
      .single()

    if (docError) throw docError

    // 3. Robust Text Extraction Loop from PDF Stream
    console.log('Step 4 -> Parsing PDF contents...');
    let extractedText = ''
    
    if (file.type === 'application/pdf') {
      extractedText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser()
        
        pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError))
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
          let textResult = ''
          for (const page of pdfData.Pages) {
            for (const textBlock of page.Texts) {
              // Decode URL-encoded characters from the PDF stream
              const blockText = decodeURIComponent(textBlock.R[0].T)
              textResult += blockText + ' '
            }
            textResult += '\n'
          }
          resolve(textResult)
        })

        pdfParser.parseBuffer(buffer)
      })
    } else {
      extractedText = buffer.toString('utf-8')
    }

    console.log(`Step 4 Success -> Extracted text length: ${extractedText?.length || 0} characters.`)

    // Safety fallback: Prevent empty loops
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("PDF text extraction resulted in empty content. The file might contain scanned images rather than selectable text.")
    }

    console.log('Step 5 -> Splitting text into fixed character chunks...');
    
    // 4. Fixed-character chunk slider loop
    const chunks = []
    const cleanText = extractedText.replace(/\s+/g, ' ').trim()
    const chunkSize = 1000 
    const overlap = 200    
    
    let i = 0
    while (i < cleanText.length) {
      chunks.push(cleanText.slice(i, i + chunkSize))
      i += (chunkSize - overlap)
    }

    console.log(`Step 5 -> Generated ${chunks.length} chunks. Syncing embeddings to pgvector...`)

    // 5. Build arrays and insert entries into database context inline
    for (const segment of chunks) {
      if (!segment.trim() || segment.length < 10) continue

      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: segment,
      })

      const [{ embedding }] = embeddingResponse.data

      const { error: chunkError } = await supabaseAdmin
        .from('document_chunks')
        .insert({
          document_id: docData.id,
          chatbot_id: chatbotId,
          content: segment,
          embedding: embedding
        })

      if (chunkError) {
        console.error('Database Chunks Table Error Detail:', chunkError)
        throw new Error(`Vector insert failure: ${chunkError.message}`)
      }
    }
    
    console.log('Step 5 Success -> All embeddings saved successfully!')
    return NextResponse.json({ success: true, filename: file.name })

  } catch (error) {
    console.error('CRITICAL PIPELINE EXCEPTION:', error)
    return NextResponse.json({ error: error.message || 'Unknown Server Error' }, { status: 500 })
  }
}