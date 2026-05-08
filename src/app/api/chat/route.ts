import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (e) {
    console.error('Chat fetch error:', e)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  
  const { message, sender_id } = await request.json()
  
  if (!message || !sender_id) {
    return NextResponse.json({ error: 'Message and sender_id required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ message, sender_id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (e) {
    console.error('Chat send error:', e)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}