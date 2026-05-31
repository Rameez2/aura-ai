'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import AdminPlanStaticManager from '@/components/AdminPlanStaticManager'

export default function AdminDashboardPage() {
  const supabase = createClient()
  
  const [users, setUsers] = useState([])
  const [activePlans, setActivePlans] = useState([]) // Loaded directly from DB now
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [adminCheck, setAdminCheck] = useState({ isChecking: true, authorized: false })

  const checkAdminAuthorization = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAdminCheck({ isChecking: false, authorized: false })
        return
      }

      const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.is_admin === true
      const isDevEmail = user.email === 'syedrameezshahpesh@gmail.com'

      if (isAdmin || isDevEmail) {
        setAdminCheck({ isChecking: false, authorized: true })
        // Fetch both datasets
        fetchSystemData()
      } else {
        setAdminCheck({ isChecking: false, authorized: false })
      }
    } catch (err) {
      setAdminCheck({ isChecking: false, authorized: false })
    }
  }

  const fetchSystemData = async () => {
    try {
      setLoading(true)

      // 1. Fetch user records
      const { data: userData, error: userErr } = await supabase
        .from('profiles')
        .select('id, business_name, email, plan_tier, token_allowance, plan_price, created_at')
        .order('created_at', { ascending: false })
      if (userErr) throw userErr
      setUsers(userData || [])

      // 2. Fetch standalone configurations
      const { data: planData, error: planErr } = await supabase
        .from('plans')
        .select('*')
      if (planErr) throw planErr
      setActivePlans(planData || [])

    } catch (err) {
      alert(`System node query initialization failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminAuthorization()
  }, [])

  // Override operations when manually clicking individual rows
  const handleUpdatePlan = async (userId, targetTier, customTokens = null) => {
    const adjustedPlan = activePlans.find(p => p.id === targetTier)
    const activeTokens = customTokens !== null ? customTokens : (adjustedPlan?.tokens || 0)

    try {
      setUpdatingId(userId)

      const { error } = await supabase
        .from('profiles')
        .update({
          plan_tier: targetTier,
          token_allowance: parseInt(activeTokens, 10)
        })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(u => u.id === userId 
        ? { ...u, plan_tier: targetTier, token_allowance: activeTokens } 
        : u
      ))

      alert('User subscription metrics modified perfectly in the cloud!')
    } catch (err) {
      alert(`Plan modification aborted: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  if (adminCheck.isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-[10px] text-slate-400 font-mono tracking-widest font-bold">EVALUATING SECURITY CLEARANCE...</p>
      </div>
    )
  }

  if (!adminCheck.authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <p className="text-xs font-mono text-rose-600 font-bold uppercase tracking-widest bg-rose-50 border border-rose-100 px-3 py-1 rounded-md">
          ⚠️ RESTRICTED AREA (403)
        </p>
        <Link href="/dashboard" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition underline">
          Return to Dashboard Secure Node
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-12 antialiased text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-900 tracking-wider uppercase">SYSTEM OVERRIDE HUB</h1>
            <p className="text-xs text-slate-400 font-medium pt-0.5">MANUAL SUBSCRIPTION MANAGEMENT TERMINAL</p>
          </div>
          <Link href="/dashboard" className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition duration-300">
            ← USER DASHBOARD
          </Link>
        </header>

        {loading ? (
          <div className="text-center py-12 text-xs font-mono font-bold text-slate-400 tracking-wider animate-pulse">
            QUERYING TENANT DATA NODES...
          </div>
        ) : (
          <>
            <AdminPlanStaticManager 
              initialPlans={activePlans} // Pass actual DB configurations here
              onPlansUpdate={() => {
                fetchSystemData() // Re-fetch all elements synchronously
              }}
              onQuickConfigSelect={(selectedBlueprint) => {
                const targetEmail = prompt("Enter the exact user email address:")
                if (!targetEmail) return
                
                const targetUser = users.find(u => u.email?.toLowerCase().trim() === targetEmail.toLowerCase().trim())
                if (!targetUser) return alert("User identifier could not be matched locally.")

                handleUpdatePlan(targetUser.id, selectedBlueprint.id, selectedBlueprint.tokens)
              }}
            />

            {/* Users Table */}
            <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] uppercase text-slate-500 tracking-wider">
                      <th className="p-4 font-bold">User Identifiers</th>
                      <th className="p-4 font-bold">Joined Date</th>
                      <th className="p-4 font-bold">Current State</th>
                      <th className="p-4 font-bold text-right">Manual Tier Override Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors duration-200">
                        <td className="p-4">
                          <p className="font-semibold text-slate-900 truncate max-w-[220px]">{user.business_name || 'Unnamed Tenant'}</p>
                          <p className="text-xs font-medium text-slate-400 truncate max-w-[220px]">{user.email}</p>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-500">
                          {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-slate-100 border-slate-200 text-slate-600">
                            {user.plan_tier || 'free'}
                          </span>
                          <p className="text-[10px] font-medium text-slate-400 font-mono">
                            {user.token_allowance?.toLocaleString() || '0'} tokens
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex flex-wrap gap-1.5 justify-end">
                            {activePlans.map((tier) => (
                              <button
                                key={tier.id}
                                disabled={updatingId === user.id}
                                onClick={() => handleUpdatePlan(user.id, tier.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all duration-200 ${
                                  user.plan_tier === tier.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-500'
                                }`}
                              >
                                {updatingId === user.id ? '...' : tier.id}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}