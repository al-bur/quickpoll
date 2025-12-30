import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Poll = {
  id: string
  question: string
  options: string[]
  created_at: string
  expires_at: string | null
  is_active: boolean
}

export type Vote = {
  id: string
  poll_id: string
  option_index: number
  voter_id: string
  created_at: string
}

export type PollWithVotes = Poll & {
  votes: { option_index: number; count: number }[]
  total_votes: number
}
