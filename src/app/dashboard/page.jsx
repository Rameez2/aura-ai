'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import ChatbotConfigPanel from '@/components/ChatBotConfigPanel'

export default function DashboardPage() {
  const supabase = createClient()
  
  // App & Identity State
  const [profile, setProfile] = useState(null)
  const [chatbots, setChatbots] = useState([])
  const [selectedChatbot, setSelectedChatbot] = useState(null) // State to track view-swaps
  const [newBotName, setNewBotName] = useState('')
  
  // Analytics Tracking State
  const [analytics, setAnalytics] = useState({
    totalTokensUsed: 0,
    totalMessagesHandled: 0,
  })

  // UI Processing States
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState(null)

  // Fetch User Profile, System Limits, and Data Aggregations
  const fetchDashboardAndMetrics = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Authentication required.')

      // 1. Fetch live user profile metrics (including plan configurations)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_name, email, plan_tier, token_allowance')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      // 2. Fetch active conversational sub-tenants with nested documents
      const { data: botsData, error: botsError } = await supabase
        .from('chatbots')
        .select(`id, name, created_at, documents(*)`) // Fetches all nested document parameters
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

      if (botsError) throw botsError
      setChatbots(botsData || [])

      // Synchronize focused view context layer parameters if it is currently open
      if (selectedChatbot) {
        const freshPanelContext = botsData.find(b => b.id === selectedChatbot.id)
        setSelectedChatbot(freshPanelContext || null)
      }

      // 3. Fetch real-time token tracking aggregates from analytics endpoint
      const response = await fetch(`/api/dashboard/analytics?profileId=${user.id}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setAnalytics({
          totalTokensUsed: analyticsData.totalTokensUsed,
          totalMessagesHandled: analyticsData.totalMessagesHandled
        })
      }

    } catch (err) {
      console.error('Dashboard load fault:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardAndMetrics()
  }, [selectedChatbot?.id])

  // Process Creating Chatbots while maintaining Tier Boundaries
  const handleCreateChatbot = async (e) => {
    e.preventDefault()
    if (!newBotName.trim()) return

    // 1. Initial frontend state threshold guardrail check
    const activeTier = profile?.plan_tier || 'free'
    if (activeTier === 'free' && chatbots.length >= 1) {
      alert('Plan Boundary Reached: Free tier accounts are limited to 1 active chatbot instance. Please upgrade your subscription to deploy more agents.')
      return
    }
    if (activeTier === 'starter' && chatbots.length >= 3) {
      alert('Plan Boundary Reached: Your Starter plan allows up to 3 active chatbots. Please upgrade your tier to extend limits.')
      return
    }
    if (activeTier === 'growth' && chatbots.length >= 10) {
      alert('Plan Boundary Reached: Your Growth plan allows up to 10 active chatbots. Upgrade to Scale for unlimited deployments.')
      return
    }

    try {
      setCreating(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error: insertError } = await supabase
        .from('chatbots')
        .insert({ name: newBotName.trim(), profile_id: user.id })
        .select().single()

      if (insertError) {
        if (insertError.message?.includes('row-level security policy') || insertError.code === '42501') {
          alert(`Plan Limit Restrained: Your active ${activeTier.toUpperCase()} tier parameters do not permit creating additional chatbot workspaces. Delete an old agent node or upgrade your subscription to clear this limit.`)
          return
        }
        throw insertError
      }

      setNewBotName('')
      await fetchDashboardAndMetrics()
    } catch (err) {
      alert(`System Error: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteChatbot = async (chatbotId) => {
    try {
      const { data: docs } = await supabase.from('documents').select('storage_path').eq('chatbot_id', chatbotId)
      if (docs && docs.length > 0) {
        const filePaths = docs.map(d => d.storage_path).filter(Boolean)
        if (filePaths.length > 0) await supabase.storage.from('kb-documents').remove(filePaths)
      }
      const { error: deleteError } = await supabase.from('chatbots').delete().eq('id', chatbotId)
      if (deleteError) throw deleteError
      
      if (selectedChatbot?.id === chatbotId) setSelectedChatbot(null)
      setChatbots(chatbots.filter(bot => bot.id !== chatbotId))
      setDeletingId(null)
      fetchDashboardAndMetrics() // Recalculate usage instantly after database shift
    } catch (err) {
      alert(`Decommission failure: ${err.message}`)
    }
  }

  const handleCopySnippet = (chatbotId) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    const snippetCode = `<iframe src="${origin}/chat/${chatbotId}" width="400" height="600" style="border:none; border-radius:12px; box-shadow:0 4px 24px rgba(0,0,0,0.25);"></iframe>`
    navigator.clipboard.writeText(snippetCode).then(() => {
      setCopiedId(chatbotId)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  // Handle visual telemetry ratio calculations dynamically
  const tokenAllowanceLimit = profile?.token_allowance || 10000
  const trackingPercentage = Math.min((analytics.totalTokensUsed / tokenAllowanceLimit) * 100, 100)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">SYNCHRONIZING TENANT SUBSCRIPTION STATES...</p>
      </div>
    )
  }

  // ========================================================
  // CONDITION 1: DISPLAY FOCUSED WORKSPACE CONFIG PANELS
  // ========================================================
  if (selectedChatbot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <ChatbotConfigPanel 
            chatbot={selectedChatbot} 
            onBack={() => setSelectedChatbot(null)} 
            onUpdate={fetchDashboardAndMetrics}
          />
        </div>
      </div>
    )
  }

  // ========================================================
  // CONDITION 2: DISPLAY MAIN STANDARD TERMINAL DASHBOARD
  // ========================================================
  return (
    <>


      {/* Main Terminal Frame */}
      <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6 md:p-12 antialiased selection:bg-blue-100">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Main Dashboard Control Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6" style={{ animation: 'slideInDown 0.6s ease-out' }}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Aura Agent Ecosystem</h1>
              <p className="text-sm text-slate-600 mt-1">
                Enterprise Tenant: <span className="text-slate-900 font-medium">{profile?.business_name || profile?.email}</span>
              </p>
            </div>
            <Link 
              href="/create-embeddings"
              className="inline-flex justify-center items-center bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 duration-300"
            >
              + Train Knowledge Base
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
              SYSTEM CRITICAL ENVELOPE: {error}
            </div>
          )}

          {/* Visual Analytics Telemetry Framework */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 card-enter">
            
            {/* Dynamic Progress Bar Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:col-span-2 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Token Allotment</h3>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {analytics.totalTokensUsed.toLocaleString()} / <span className="text-slate-500 text-sm font-normal">{tokenAllowanceLimit.toLocaleString()} TOKENS</span>
                  </p>
                </div>
                <span className="text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-md uppercase tracking-wider">
                  {profile?.plan_tier || 'FREE'} PLAN
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-slate-100 h-3 border border-slate-200 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${trackingPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>0% COMMITTED</span>
                  <span className="text-blue-600">{trackingPercentage.toFixed(1)}% PLAN SATURATION</span>
                </div>
              </div>
            </div>

            {/* Conversation Metric Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Routed Inquiries</h3>
              <div className="my-auto pt-2">
                <p className="text-5xl font-bold tracking-tight text-slate-900">
                  {analytics.totalMessagesHandled.toLocaleString()}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Active transactional completions</p>
              </div>
            </div>
          </section>

          {/* Create Chatbot Input Block Form */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm card-enter" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Provision New Node Instance</h2>
              <p className="text-xs text-slate-500">Initialize an isolated sub-tenant context pipeline. Current limits bounded by your tier parameters.</p>
            </div>
            <form onSubmit={handleCreateChatbot} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                placeholder="e.g., Global Sales Dispatcher, Live QA Bot"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder-slate-400"
                required
                disabled={creating}
              />
              <button
                type="submit"
                disabled={creating || !newBotName.trim()}
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-6 rounded-lg text-sm transition shadow-md shadow-blue-600/10 active:scale-[0.99] disabled:opacity-50 py-2.5 sm:py-0"
              >
                {creating ? 'DEPLOYING...' : 'PROVISION'}
              </button>
            </form>
          </section>

          {/* Dynamic Chatbots Grid Renderer */}
          <section className="space-y-4 card-enter" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Nodes Sub-Grid ({chatbots.length})</h2>
            
            {chatbots.length === 0 ? (
              <div className="border border-dashed border-slate-300 bg-white/50 rounded-xl p-12 text-center text-slate-500 text-sm font-medium uppercase tracking-wider shadow-sm">
                No active conversational nodes running. Spin up a pipeline above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chatbots.map((bot) => (
                  <div 
                    key={bot.id}
                    onClick={() => setSelectedChatbot(bot)}
                    className="bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-6 flex flex-col justify-between cursor-pointer transition shadow-sm hover:shadow-md duration-300 relative overflow-hidden group space-y-6"
                  >
                    {/* Inline Delete Warning Overlay */}
                    {deletingId === bot.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="absolute inset-0 bg-white/95 z-10 p-6 flex flex-col justify-center items-center text-center space-y-4 backdrop-blur-sm animate-fade-in"
                      >
                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Wipe Node Core Frame?</p>
                        <p className="text-[11px] text-slate-500 max-w-[210px]">Permanently deletes this chatbot instance, its source data files, and structural vector alignments.</p>
                        <div className="flex gap-2 w-full max-w-[220px]">
                          <button
                            onClick={() => handleDeleteChatbot(bot.id)}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold py-2 rounded-lg transition shadow-sm"
                          >
                            CONFIRM
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium py-2 rounded-lg transition"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition truncate">{bot.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation() 
                            setDeletingId(bot.id)
                          }}
                          className="text-slate-300 hover:text-rose-600 transition text-sm p-0.5 z-20"
                          title="Decommission Node"
                        >
                          🗑️
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono truncate uppercase">NODE ADDR: {bot.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3 text-center">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Data Footprint</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          {bot.documents?.length || 0} <span className="text-xs font-normal text-slate-400">Files</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Active Since</p>
                        <p className="text-xs font-bold text-slate-600 mt-1">
                          {new Date(bot.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation() 
                          setSelectedChatbot(bot)
                        }}
                        className="flex-1 text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-[11px] transition tracking-wide uppercase"
                      >
                        Configure Bot
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation() 
                          handleCopySnippet(bot.id)
                        }}
                        className={`px-3 py-2 rounded-lg text-[11px] tracking-wide transition font-semibold flex items-center justify-center min-w-[100px] uppercase ${
                          copiedId === bot.id 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {copiedId === bot.id ? 'COPIED! ✓' : 'COPY EMBED'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  )
}