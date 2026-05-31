'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ChatbotConfigPanel({ chatbot, onBack, onUpdate }) {
    const supabase = createClient()
    const [botName, setBotName] = useState(chatbot?.name || '')
    const [isSavingName, setIsSavingName] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isDeletingFile, setIsDeletingFile] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')
    const fileInputRef = useRef(null)

    // Sync input field state when chatbot prop modifications trickle down
    useEffect(() => {
        if (chatbot?.name) setBotName(chatbot.name)
    }, [chatbot])

    // Track the active document safely from your chatbot relation mapping
    const attachedFile = chatbot?.documents?.[0]

    // 1. Update Chatbot Name via Database Direct Write
    const handleUpdateName = async (e) => {
        e.preventDefault()
        if (!botName.trim()) return

        try {
            setIsSavingName(true)
            
            const { data, error } = await supabase
                .from('chatbots')
                .update({ name: botName.trim() })
                .eq('id', chatbot.id)
                .select()

            if (error) throw error

            if (!data || data.length === 0) {
                throw new Error("RLS updates denied. Row unchanged.")
            }

            alert('Identity updated successfully!')
            if (onUpdate) onUpdate() 
        } catch (err) {
            console.error(err)
            alert(`Identity update failed: ${err.message}`)
        } finally {
            setIsSavingName(false)
        }
    }

    // 2. Delete/Purge Document Metadata Trackers
    const handleDeleteFile = async () => {
        if (!attachedFile) return
        
        try {
            setIsDeletingFile(true)
            const targetId = attachedFile.id

            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', targetId)

            if (error) throw error

            alert('Knowledge asset cleared successfully!')
            if (onUpdate) onUpdate() 
        } catch (err) {
            alert(`Purge fault: ${err.message}`)
        } finally {
            setIsDeletingFile(false)
        }
    }

    // 3. Upload uses your proven API Pipeline architecture
    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        if (selectedFile.type !== 'application/pdf') {
            alert('Only standard PDF documents are supported at this time.')
            return
        }

        try {
            setIsUploading(true)
            setUploadStatus('Syncing document with vector pipeline...')

            // Optional: If there's an existing file, clear its row tracking first
            if (attachedFile) {
                await supabase.from('documents').delete().eq('id', attachedFile.id)
            }

            // Package data into FormData exactly like your working training page
            const formData = new FormData()
            formData.append('file', selectedFile)
            formData.append('chatbotId', chatbot.id)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Pipeline execution failed.')
            }

            alert(`✓ Successfully trained! "${result.filename || selectedFile.name}" has been fully embedded.`)
            if (onUpdate) onUpdate() 
        } catch (err) {
            console.error(err)
            alert(`Knowledge upload fault: ${err.message}`)
        } finally {
            setIsUploading(false)
            setUploadStatus('')
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const embedCodeString = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/chat/${chatbot?.id}" width="400" height="600" style="border:none; position:fixed; bottom:20px; right:20px; z-index:9999;"></iframe>`

    return (
        <div className="space-y-8 min-h-screen bg-transparent p-1 md:p-4 font-sans text-slate-800">
            {/* Context Navigation Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <button
                    onClick={onBack}
                    className="text-xs font-semibold tracking-wide text-slate-500 hover:text-blue-600 flex items-center gap-2 transition duration-300"
                >
                    ← BACK TO WORKSPACES
                </button>
                <span className="text-[10px] font-bold uppercase bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-md tracking-wider">
                    Active Workspace Node
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Identity Settings Block */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identity Settings</h2>
                        <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={botName}
                                onChange={(e) => setBotName(e.target.value)}
                                disabled={isSavingName}
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSavingName || botName.trim() === chatbot?.name}
                                className="bg-blue-600 text-white disabled:opacity-40 font-semibold text-xs px-5 py-2.5 sm:py-0 rounded-lg shadow-md shadow-blue-600/10 hover:bg-blue-700 transition duration-300"
                            >
                                {isSavingName ? 'SAVING...' : 'UPDATE'}
                            </button>
                        </form>
                    </div>

                    {/* Knowledge Base Input Section */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Context Source Base (RAG Data)</h2>

                        {attachedFile ? (
                            <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg font-bold text-xs text-blue-600">PDF</div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-800 truncate max-w-xs md:max-w-md">
                                            {attachedFile.name || attachedFile.file_name || attachedFile.title || 'Grounding Data Asset'}
                                        </p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-0.5">STATUS: VECTOR EMBEDDED</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading || isDeletingFile}
                                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm"
                                    >
                                        REPLACE
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteFile}
                                        disabled={isUploading || isDeletingFile}
                                        className="bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 text-xs font-semibold px-3 py-2 rounded-lg transition"
                                    >
                                        {isDeletingFile ? 'PURGING...' : 'DELETE'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-300 bg-slate-50/50 p-8 rounded-xl text-center space-y-4">
                                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                                    {uploadStatus || 'This agent currently holds zero custom grounding data rules. Provide an operational PDF to train its knowledge array.'}
                                </p>
                                {!isUploading && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition shadow-sm"
                                    >
                                        UPLOAD PDF
                                    </button>
                                )}
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Right Column: Deployment Embed */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <div>
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Embed Deployment</h2>
                            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">Copy this iframe snippet and drop it into your web pages to render the chatbot interface.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-[11px] text-slate-600 break-all select-all leading-relaxed max-h-[140px] overflow-y-auto">
                            {embedCodeString}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(embedCodeString)
                                alert('Embed snippet copied to clipboard.')
                            }}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg transition shadow-md shadow-slate-900/10 active:scale-[0.99]"
                        >
                            COPY CODE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}