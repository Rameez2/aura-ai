'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ProfilePage() {
    const supabase = createClient()
    
    // Profile information states
    const [email, setEmail] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [initialBusinessName, setInitialBusinessName] = useState('')
    
    // UI Feedback states
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Fetch user and profile data on mount
    useEffect(() => {
        async function fetchProfileData() {
            try {
                setIsLoading(true)
                
                // Get authenticated session user
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError) throw userError

                if (user) {
                    setEmail(user.email || '')
                    
                    // Fetch corresponding profile/organization row
                    // Adjust the table name ('profiles' / 'users') and columns to match your exact schema
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('business_name')
                        .eq('id', user.id)
                        .single()

                    if (error && error.code !== 'PGRST116') throw error // Ignore single row not found code to let them initialize it

                    if (data?.business_name) {
                        setBusinessName(data.business_name)
                        setInitialBusinessName(data.business_name)
                    }
                }
            } catch (err) {
                console.error('Error fetching profile records:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfileData()
    }, [supabase])

    // Update Business Name via Database Write
// Update Business Name via Database Write
const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!businessName.trim()) return

    try {
        setIsSaving(true)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No active authentication token found.")

        // Include the email in the payload to satisfy the NOT-NULL constraint
        const { error } = await supabase
            .from('profiles')
            .upsert({ 
                id: user.id,
                email: user.email, // <-- Added this line to pass the constraint
                business_name: businessName.trim()
            })

        if (error) throw error

        alert('Profile configuration updated successfully!')
        setInitialBusinessName(businessName.trim())
    } catch (err) {
        console.error(err)
        alert(`Profile update failed: ${err.message}`)
    } finally {
        setIsSaving(false)
    }
}

    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center font-sans">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 animate-pulse">
                    Retrieving Core Profile Data...
                </span>
            </div>
        )
    }

    return (
        <div className="space-y-8 min-h-screen bg-transparent p-1 md:p-4 font-sans text-slate-800">
            {/* Context Navigation Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h1 className="text-sm font-bold font-mono tracking-wider text-slate-500 uppercase">
                    Account Control Center
                </h1>
                <span className="text-[10px] font-bold uppercase bg-blue-50 border border-blue-100 text-blue-600 px-3 py-1 rounded-md tracking-wider">
                    Identity Node
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns: Main Form Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
                        <div>
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Information</h2>
                            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                                Manage your global application identity status and workspace designations.
                            </p>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            {/* Read-Only Email Field */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Account Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed select-none focus:outline-none"
                                    />
                                    <span className="absolute right-3 top-2.5 text-[9px] font-mono uppercase font-bold tracking-wider bg-slate-200 border border-slate-300 text-slate-500 px-2 py-0.5 rounded">
                                        LOCKED
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">
                                    Primary authentication identifier cannot be modified from this terminal node.
                                </p>
                            </div>

                            {/* Editable Business Name Field */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Business / Organization Name
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    disabled={isSaving}
                                    placeholder="Enter your SaaS product or entity name"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm transition-all duration-300 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                                    required
                                />
                            </div>

                            {/* Form Action CTA */}
                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={isSaving || businessName.trim() === initialBusinessName}
                                    className="bg-blue-600 text-white disabled:opacity-40 font-semibold text-xs px-6 py-2.5 rounded-lg shadow-md shadow-blue-600/10 hover:bg-blue-700 transition duration-300"
                                >
                                    {isSaving ? 'COMMIT-SAVING...' : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Information Sidecard */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tenant Scope</h2>
                        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                            <p>
                                Updates written to your business moniker will automatically cascades across all live multi-tenant chat configurations and iframe deployments.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-[11px] text-slate-500 space-y-1">
                                <div>SCOPE: GLOBAL_WORKSPACE</div>
                                <div>ROLE: SYSTEM_OWNER</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}