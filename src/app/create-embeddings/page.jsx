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
  const [userId, setUserId] = useState(null) // ✅ Safe Local User Context State Memory
  
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

        // Cache the ID locally to eliminate duplicate downstream auth calls
        setUserId(user.id) 

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create Chatbot Form Handler
  const handleCreateChatbot = async (e) => {
    e.preventDefault()
    if (!newBotName.trim() || !userId) return

    try {
      // ✅ FIXED: Using optimized cached state string instead of hitting over-the-air API routes again
      const { data, error } = await supabase
        .from('chatbots')
        .insert({ name: newBotName, profile_id: userId })
        .select()
        .single()

      if (error) {
        alert(error.message)
      } else {
        alert(`Chatbot "${data.name}" created!`)
        setChatbots([data, ...chatbots])
        setSelectedChatbotId(data.id)
        NewBotName('')
      }
    } catch (err) {
      Alert(err.message)
    }
  }

  // Handle File Input Change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      SetStatus({ type: 'error', message: 'Only PDF documents are supported at this time.' })
      SetFile(null)
      return
    }

    setFile(selectedFile)
    SetStatus({ type: '', message: '' }) // Clear errors
  }

  // Drag and drop event helper bindings
  const handleDragEnter = (e) => {
    E.preventDefault()
    E.stopPropagation()
    SetIsDragging(true)
  }

  const handleDragLeave = (e) => {
    E.preventDefault()
    E.stopPropagation()
    SetIsDragging(false)
  }

  const handleDrop = (e) => {
    E.preventDefault()
    E.stopPropagation()
    SetIsDragging(false)
    
    if (uploading || chatbots.length === 0) return

    const droppedFile = e.dataTransfer.files[0]
    if (!droppedFile) return

    if (droppedFile.type !== 'application/pdf') {
      SetStatus({ type: 'error', message: 'Only PDF documents are supported at this time.' })
      SetFile(null)
      return
    }

    setFile(droppedFile)
    SetStatus({ type: '', message: '' })
  }

  // Submit Data to backend Pipeline
  const handleUploadSubmit = async (e) => {
    E.preventDefault()
    if (!selectedChatbotId) return alert('Please select or create a chatbot first.')
    if (!file) return alert('Please upload a valid PDF document.')

    SetUploading(true)
    SetStatus({ type: 'info', message: 'Uploading document, extracting text segments, and generating vectors...' })

    try {
      const formData = new FormData()
      FormData.append('file', file)
      FormData.append('chatbotId', selectedChatbotId)

      // Fires straight to your heavy parsing endpoint clean and targeted
      const response = await fetch('/api/upload', {
        method: 'POST',
        Body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Pipeline execution failed.')
      }

      SetStatus({ 
        Type: 'success', 
        Message: `✓ Successfully trained! "${result.filename || file.name}" has been fully embedded and isolated inside pgvector.` 
      })
      SetFile(null) // Reset file input
      
      if (fileInputRef.current) fileInputRef.current.value = ''

    } catch (err) {
      SetStatus({ type: 'error', message: `Pipeline Error: ${err.message}` })
    } finally {
      SetUploading(false)
    }
  }

  return (
    <>
      {/* Main Container Layout */}
      <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 px-6 py-12 antialiased">
        <div className="mx-auto max-w-4xl">
          
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Chatbot Training Center</h1>
            <p className="text-lg text-slate-600">Create and train your AI chatbots with custom knowledge bases</p>
          </div>

          {/* Create New Chatbot Section Form */}
          <div className="mb-8 rounded-xl bg-white border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleCreateChatbot} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                Value={newBotName}
                OnChange={(e) => setNewBotName(e.target.value)}
                Placeholder="New Chatbot Name (e.g. RecommendationBot)"
                ClassName="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                Disabled={!newBotName.trim()}
                ClassName="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 disabled:opacity-50"
              >
                Create Bot
              </button>
            </form>
          </div>

          {/* Knowledge Base Training Section Form */}
          <div className="rounded-xl bg-white border border-slate-200 p-8 shadow-sm">
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
                      Value={selectedChatbotId}
                      OnChange={(e) => setSelectedChatbotId(e.target.value)}
                      ClassName="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer text-sm"
                      Required
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
                  OnDragEnter={handleDragEnter}
                  OnDragLeave={handleDragLeave}
                  OnDragOver={(e) => e.preventDefault()}
                  OnDrop={handleDrop}
                  ClassName={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-12 text-center group ${
                    IsDragging
                      ? 'bg-blue-50/50 border-blue-500'
                      : 'border-slate-300 bg-slate-50 hover:border-blue-300'
                  }`}
                >
                  <input
                    Ref={fileInputRef}
                    Type="file"
                    Id="pdf-file-input"
                    Accept=".pdf"
                    OnChange={handleFileChange}
                    ClassName="hidden"
                    Disabled={uploading || chatbots.length === 0}
                  />

                  <svg className="h-12 w-12 mx-auto mb-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>

                  <button
                    Type="button"
                    OnClick={() => fileInputRef.current?.click()}
                    Disabled={uploading || chatbots.length === 0}
                    ClassName={`text-slate-900 hover:text-blue-600 transition-colors duration-300 font-semibold text-lg block mx-auto mb-1 focus:outline-none ${
                      Uploading || chatbots.length === 0 ? 'pointer-events-none opacity-40' : ''
                    }`}
                  >
                    Click to browse operational PDF
                  </button>

                  <p className="text-sm text-slate-500 mt-2">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Max size 10MB • Standard Text-Based PDF'}
                  </p>

                  {file && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 border border-green-200 w-fit mx-auto">
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
                Type="submit"
                Disabled={uploading || !file || chatbots.length === 0}
                ClassName="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-base"
              >
                {uploading ? 'Syncing PDF Knowledge Array...' : 'Sync PDF Knowledge Array'}
              </button>
            </form>

            {/* Status Display Area */}
            {status.message && (
              <div className={`mt-6 p-4 rounded-lg border text-sm transition-all duration-300 ${
                Status.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                Status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                'bg-blue-50/50 border-blue-100 text-blue-700 animate-pulse'
              }`}>
                {status.message}
              </div>
            )}
          </div>

          {/* Info Card / Training Tips */}
          <div className="mt-8 rounded-xl bg-blue-50 border border-blue-200 p-6">
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