'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AdminPlanStaticManager({ initialPlans, onPlansUpdate, onQuickConfigSelect }) {
    const supabase = createClient()
    
    // Pass initialPlans directly to seed the initial state instance safely
    const [systemPlans, setSystemPlans] = useState(initialPlans || [])
    const [editingId, setEditingId] = useState(null)
    const [isPushing, setIsPushing] = useState(false)

    const handleLocalChange = (id, field, value) => {
        setSystemPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    }

    const handleLockAndPushCloud = async (planId) => {
        const targetPlan = systemPlans.find(p => p.id === planId)
        if (!targetPlan) return

        try {
            setIsPushing(true)

            const { error: blueprintErr } = await supabase
                .from('plans')
                .update({ 
                    tokens: parseInt(targetPlan.tokens, 10),
                    price: parseFloat(targetPlan.price)
                })
                .eq('id', planId)

            if (blueprintErr) throw blueprintErr

            const { error: profilesErr } = await supabase
                .from('profiles')
                .update({ token_allowance: parseInt(targetPlan.tokens, 10) })
                .eq('plan_tier', planId)

            if (profilesErr) throw profilesErr

            if (onPlansUpdate) onPlansUpdate()

            alert(`Cloud Sync Successful: Updated configuration master blueprints for all "${planId}" accounts perfectly.`)
            setEditingId(null)
        } catch (err) {
            alert(`Cloud update transmission interrupted: ${err.message}`)
        } finally {
            setIsPushing(false)
        }
    }

    if (!systemPlans || systemPlans.length === 0) return null

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6 text-slate-800">
            <div>
                <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Aura AI Code-Tier Blueprint</h2>
                <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                    Modify structural defaults. Locking changes updates both the master template configurations and matching customer tiers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemPlans.map((plan) => (
                    <div key={plan.id} className="p-4 border border-slate-200 bg-slate-50 rounded-xl space-y-3 transition hover:border-slate-300">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">{plan.name}</span>
                            <span className="text-xs font-mono font-bold text-blue-600">${plan.price}/mo</span>
                        </div>

                        {editingId === plan.id ? (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Tokens</label>
                                        <input 
                                            type="number" 
                                            value={plan.tokens} 
                                            onChange={(e) => handleLocalChange(plan.id, 'tokens', parseInt(e.target.value, 10) || 0)}
                                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">Price ($)</label>
                                        <input 
                                            type="number" 
                                            value={plan.price} 
                                            onChange={(e) => handleLocalChange(plan.id, 'price', parseFloat(e.target.value) || 0)}
                                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    disabled={isPushing}
                                    onClick={() => handleLockAndPushCloud(plan.id)}
                                    className="w-full bg-slate-900 text-white text-[10px] font-bold py-1.5 rounded transition uppercase tracking-wide hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {isPushing ? 'SAVING TO CLOUD...' : 'SAVE & SYNC USER DATA'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1.5 text-xs text-slate-600 font-mono text-[11px]">
                                <div className="flex justify-between"><span>Token Allowance:</span> <span className="font-bold text-slate-800">{Number(plan.tokens).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Chatbot Units:</span> <span className="font-bold text-slate-800">{plan.chatbots}</span></div>
                                <div className="flex justify-between"><span>Max File Payload:</span> <span className="font-bold text-slate-800">{plan.storage}</span></div>
                                
                                <div className="pt-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(plan.id)}
                                        className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[10px] font-bold py-1 rounded transition uppercase tracking-wider"
                                    >
                                        Adjust Metrics
                                    </button>
                                    {onQuickConfigSelect && (
                                        <button
                                            type="button"
                                            onClick={() => onQuickConfigSelect(plan)}
                                            className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold py-1 rounded transition uppercase tracking-wider border border-blue-100"
                                        >
                                            Direct Apply
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}