import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { USING_MOCK_DATA } from './utils';

// PENTING: Aplikasi ini sekarang menggunakan mock data, bukan Supabase
// Lihat file dataService.ts untuk implementasi mock data
// Kode di bawah ini tidak digunakan lagi, tetapi tetap disimpan untuk referensi

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Supabase client dinonaktifkan, menggunakan mock data
export const supabase: SupabaseClient | null = USING_MOCK_DATA 
  ? null 
  : (supabaseUrl && supabaseAnonKey)
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
