import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log('🔧 Supabase Config Check:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Present' : 'Missing');

// Create Supabase client
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.error('❌ Supabase client failed to initialize. Check your environment variables.');
  console.log('Expected variables:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
} else {
  console.log('✅ Supabase client initialized successfully');
}

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
