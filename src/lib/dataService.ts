import { supabase } from './supabase';

export interface UserRecord {
  id: string;
  nip: string;
  name: string;
  division: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'user';
  created_at?: string;
  updated_at?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  user_id: string;
  admin_response?: string;
  created_at?: string;
  updated_at?: string;
  // Join dengan user
  user?: UserRecord;
}

// Note: Data mock sudah dihapus, sekarang menggunakan Supabase database

// Fungsi untuk mendapatkan daftar pengguna
export async function getUsers() {
  try {
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data, error } = await supabase
      .from('users')
      .select('id, nip, name, division, email, phone, role, created_at')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fungsi untuk mendapatkan daftar tiket
export async function getTickets() {
  try {
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        user:users(id, nip, name, division, email, phone, role)
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fungsi untuk memperbarui tiket
export async function updateTicket(ticketId: string, data: { status?: string; admin_response?: string }) {
  try {
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data: updatedTicket, error } = await supabase
      .from('tickets')
      .update({
        ...(data.status && { status: data.status }),
        ...(data.admin_response && { admin_response: data.admin_response }),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select(`
        *,
        user:users(id, nip, name, division, email, phone, role)
      `)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { ok: true, data: updatedTicket };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fungsi untuk login user menggunakan database users
export async function loginUser(nip: string, password: string) {
  try {
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    // Cari user berdasarkan NIP
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nip', nip)
      .single();
    
    if (error) {
      return { ok: false, error: 'NIP tidak ditemukan' };
    }
    
    // Untuk demo, password bisa berupa NIP atau "password123"
    if (password === user.nip || password === "password123") {
      // Simpan user ke localStorage untuk simulasi session
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { ok: true, data: user };
    } else {
      return { ok: false, error: 'Password salah' };
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fungsi untuk registrasi user menggunakan mock data
// Fungsi untuk membuat tiket baru
export async function createTicket(ticketData: {
  title: string;
  description: string;
  category: string;
  priority: string;
  user_id: string;
}) {
  try {
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        status: 'open',
        user_id: ticketData.user_id
      })
      .select(`
        *,
        user:users(id, nip, name, division, email, phone, role)
      `)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function registerUser(userData: {
  name: string;
  nip: string;
  division: string;
  email?: string;
  phone?: string;
  password: string;
}) {
  try {
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    // Insert user baru ke database
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        nip: userData.nip,
        division: userData.division,
        email: userData.email,
        phone: userData.phone,
        role: 'user',
        password: userData.password // Note: Dalam production, hash password ini
      })
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { ok: false, error: 'NIP sudah terdaftar' };
      }
      throw error;
    }
    
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
