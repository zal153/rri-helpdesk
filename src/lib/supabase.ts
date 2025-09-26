import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create Supabase client
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserRecord {
  id: string;
  nip: string;
  name: string;
  division: string;
  email?: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at?: string;
}
