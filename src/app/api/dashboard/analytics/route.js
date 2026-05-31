import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    // 1. Resolve user profile tracking headers from the incoming client request session
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (!profileId) {
      return new Response(JSON.stringify({ error: 'Missing profile identification context' }), { status: 400 })
    }

    // 2. Set timestamp boundary for the first day of the current calendar month
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    // 3. Query all logs matching this profile for the current month
    const { data: logs, error: logsError } = await supabaseAdmin
      .from('usage_logs')
      .select('total_tokens, created_at')
      .eq('profile_id', profileId)
      .gte('created_at', firstDayOfMonth.toISOString())

    if (logsError) throw logsError

    // 4. Calculate core total metrics
    const totalTokensUsed = logs.reduce((sum, item) => sum + item.total_tokens, 0)
    const totalMessagesHandled = logs.length

    // 5. Build daily volume analytics array (Last 7 days trend baseline)
    const dailyVolumeMap = {}
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    // Initialize map keys with 0 values
    last7Days.forEach(dateStr => {
      dailyVolumeMap[dateStr] = 0
    })

    // Populate actual logs database counts into the matching date key bucket
    logs.forEach(log => {
      const dateKey = log.created_at.split('T')[0]
      if (dailyVolumeMap[dateKey] !== undefined) {
        dailyVolumeMap[dateKey] += 1
      }
    })

    const chartData = Object.keys(dailyVolumeMap).map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      count: dailyVolumeMap[date]
    }))

    return new Response(JSON.stringify({
      totalTokensUsed,
      totalMessagesHandled,
      chartData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Analytics system fault:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}