'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function CreateEmbeddingsPage() {
  const supabase = createClient()
  const fileInputRef = useRef(null)

  // App States
  const [chatbots, setChatbots] = useState([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [file, setFile] = useState(null)
  const [newBotName, setNewBotName] = useState('')
  
  // UI Management States
  const [fetchingBots, setFetchingBots] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isDragging, setIsDragging] = useState(false)

  // 1. Fetch user's chatbots on component load
  useEffect(() => {
    const fetchUserChatbots = async () => {
      try {
        setFetchingBots(true)
        
        // Get currently logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          setStatus({ type: 'error', message: 'Authentication required. Please log in first.' })
          return
        }

        // Fetch chatbots belonging to this user profile
        const { data, error } = await supabase
          .from('chatbots')
          .select('id, name')
          .eq('profile_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setChatbots(data || [])
        if (data && data.length > 0) {
          setSelectedChatbotId(data[0].id) // Default select the first bot
        }
      } catch (err) {
        console.error('Failed to load chatbots:', err.message)
        setStatus({ type: 'error', message: 'Failed to load your chatbots.' })
      } finally {
        setFetchingBots(false)
      }
    }

    fetchUserChatbots()
  }, [])

  // Create Chatbot Form Handler
  const handleCreateChatbot = async (e) => {
    e.preventDefault()
    if (!newBotName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('chatbots')
        .insert({ name: newBotName, profile_id: user.id })
        .select()
        .single()

      if (error) {
        alert(error.message)
      } else {
        alert(`Chatbot "${data.name}" created!`)
        setChatbots([data, ...chatbots])
        setSelectedChatbotId(data.id)
        setNewBotName('')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Handle File Input Change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Only PDF documents are supported at this time.' })
      setFile(null)
      return
    }

    setFile(selectedFile)
    setStatus({ type: '', message: '' }) // Clear errors
  }

  // Drag and drop event helper bindings
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (uploading || chatbots.length === 0) return

    const droppedFile = e.dataTransfer.files[0]
    if (!droppedFile) return

    if (droppedFile.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Only PDF documents are supported at this time.' })
      setFile(null)
      return
    }

    setFile(droppedFile)
    setStatus({ type: '', message: '' })
  }

  // Submit Data to backend Pipeline
  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!selectedChatbotId) return alert('Please select or create a chatbot first.')
    if (!file) return alert('Please upload a valid PDF document.')

    setUploading(true)
    setStatus({ type: 'info', message: 'Uploading document, extracting text segments, and generating vectors...' })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatbotId', selectedChatbotId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Pipeline execution failed.')
      }

      setStatus({ 
        type: 'success', 
        message: `✓ Successfully trained! "${result.filename || file.name}" has been fully embedded and isolated inside pgvector.` 
      })
      setFile(null) // Reset file input
      
      // Clear file input DOM element manually safely using ref
      if (fileInputRef.current) fileInputRef.current.value = ''

    } catch (err) {
      setStatus({ type: 'error', message: `Pipeline Error: ${err.message}` })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>

      {/* Main Container Layout */}
      <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-12 antialiased">
        <div className="mx-auto max-w-4xl">
          
          {/* Header Section */}
          <div className="mb-12" style={{ animation: 'slideInDown 0.6s ease-out' }}>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Chatbot Training Center</h1>
            <p className="text-lg text-slate-600">Create and train your AI chatbots with custom knowledge bases</p>
          </div>

          {/* Create New Chatbot Section Form */}
          <div className="mb-8 card-enter rounded-xl bg-white border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleCreateChatbot} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                placeholder="New Chatbot Name (e.g. RecommendationBot)"
                className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
              >
                Create Bot
              </button>
            </form>
          </div>

          {/* Knowledge Base Training Section Form */}
          <div className="card-enter rounded-xl bg-white border border-slate-200 p-8 shadow-sm" style={{ animationDelay: '0.1s' }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Knowledge Base Training</h2>
              <p className="text-slate-600">Feed operational data to specific chatbot instances using PDF documents.</p>
            </div>

            <form onSubmit={handleUploadSubmit}>
              {/* Target Chatbot Context */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">
                  Target Chatbot Context
                </label>
                
                {fetchingBots ? (
                  <div className="h-12 w-full bg-slate-100 border border-slate-200 rounded-lg animate-pulse" />
                ) : chatbots.length === 0 ? (
                  <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    No chatbots found. Please create a chatbot model in the step above before uploading context files.
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedChatbotId}
                      onChange={(e) => setSelectedChatbotId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer text-sm"
                      required
                    >
                      {chatbots.map((bot) => (
                        <option key={bot.id} value={bot.id}>
                          {bot.name} ({bot.id.slice(0, 8)}...)
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload PDF Section */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-4">
                  Upload PDF Knowledge Source
                </label>
                
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-12 text-center group ${
                    isDragging
                      ? 'drop-zone-active bg-blue-50/50 border-blue-500'
                      : 'border-slate-300 bg-slate-50 hover:border-blue-300'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="pdf-file-input"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading || chatbots.length === 0}
                  />

                  <svg className="h-12 w-12 mx-auto mb-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || chatbots.length === 0}
                    className={`text-slate-900 hover:text-blue-600 transition-colors duration-300 font-semibold text-lg block mx-auto mb-1 focus:outline-none ${
                      uploading || chatbots.length === 0 ? 'pointer-events-none opacity-40' : ''
                    }`}
                  >
                    Click to browse operational PDF
                  </button>

                  <p className="text-sm text-slate-500 mt-2">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Max size 10MB • Standard Text-Based PDF'}
                  </p>

                  {file && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 border border-green-200 w-fit mx-auto animate-fade-in">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-700">{file.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sync Button */}
              <button
                type="submit"
                disabled={uploading || !file || chatbots.length === 0}
                className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-base"
              >
                {uploading ? 'Syncing PDF Knowledge Array...' : 'Sync PDF Knowledge Array'}
              </button>
            </form>

            {/* Dynamic Status Display Message Area */}
            {status.message && (
              <div className={`mt-6 p-4 rounded-lg border text-sm transition-all duration-300 ${
                status.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                'bg-blue-50/50 border-blue-100 text-blue-700 animate-pulse'
              }`}>
                {status.message}
              </div>
            )}
          </div>

          {/* Info Card / Training Tips */}
          <div className="mt-8 rounded-xl bg-blue-50 border border-blue-200 p-6 card-enter" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-4">
              <svg className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Training Tips</h3>
                <p className="text-sm text-blue-800">
                  Upload relevant PDF documents to train your chatbot with specialized knowledge. The AI will learn from the content and provide better, contextual responses to customer queries.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}