import { supabase } from './supabase';
import { UserRecord } from './supabase';

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

// Mock data pengguna
const mockUsers = [
  {
    id: '1',
    nip: '123456',
    name: 'Admin Utama',
    division: 'IT',
    email: 'admin@rri.co.id',
    phone: '08123456789',
    role: 'admin',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    nip: '234567',
    name: 'Pengguna Satu',
    division: 'Teknik',
    email: 'user1@rri.co.id',
    phone: '08234567890',
    role: 'user',
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    nip: '345678',
    name: 'Pengguna Dua',
    division: 'Siaran',
    email: 'user2@rri.co.id',
    phone: '08345678901',
    role: 'user',
    created_at: '2023-01-03T00:00:00Z'
  }
];

// Mock data tiket
let mockTickets: Ticket[] = [
  {
    id: 'ticket-001',
    title: 'Komputer tidak bisa menyala',
    description: 'Komputer di ruang siaran tidak bisa menyala sama sekali',
    category: 'Hardware',
    priority: 'high',
    status: 'open',
    user_id: '2',
    created_at: '2023-08-15T10:30:00Z',
    updated_at: '2023-08-15T10:30:00Z',
    user: {
      id: '2',
      nip: '234567',
      name: 'Pengguna Satu',
      division: 'Teknik',
      role: 'user'
    }
  },
  {
    id: 'ticket-002',
    title: 'Aplikasi siaran error',
    description: 'Aplikasi siaran mengalami crash saat digunakan untuk rekaman',
    category: 'Software',
    priority: 'medium',
    status: 'in_progress',
    user_id: '3',
    admin_response: 'Sedang dilakukan pengecekan aplikasi',
    created_at: '2023-08-14T08:15:00Z',
    updated_at: '2023-08-15T09:20:00Z',
    user: {
      id: '3',
      nip: '345678',
      name: 'Pengguna Dua',
      division: 'Siaran',
      role: 'user'
    }
  },
  {
    id: 'ticket-003',
    title: 'Jaringan internet lambat',
    description: 'Koneksi internet sangat lambat di ruang produksi',
    category: 'Network',
    priority: 'low',
    status: 'resolved',
    user_id: '2',
    admin_response: 'Router telah di-restart dan koneksi sudah normal kembali',
    created_at: '2023-08-13T13:45:00Z',
    updated_at: '2023-08-14T10:15:00Z',
    user: {
      id: '2',
      nip: '234567',
      name: 'Pengguna Satu',
      division: 'Teknik',
      role: 'user'
    }
  }
];

// Fungsi untuk mendapatkan daftar pengguna
export async function getUsers() {
  try {
    // Gunakan data statis untuk mengatasi masalah rekursi
    return { ok: true, data: mockUsers };
    
    // Kode asli dengan Supabase
    /*
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data, error } = await supabase
      .from('users')
      .select('id, nip, name, division, email, phone, role, created_at')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { ok: true, data };
    */
  } catch (error) {
    console.error('Error fetching users:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fungsi untuk mendapatkan daftar tiket
export async function getTickets() {
  try {
    // Gunakan data statis untuk mengatasi masalah rekursi
    return { ok: true, data: mockTickets };
    
    // Kode asli dengan Supabase
    /*
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        user:users(id, nip, name, division, email, phone, role)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { ok: true, data };
    */
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fungsi untuk memperbarui tiket
export async function updateTicket(ticketId: string, data: { status?: string; admin_response?: string }) {
  try {
    // Perbarui data statis
    mockTickets = mockTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
      return ticket;
    });
    
    // Kembalikan tiket yang diperbarui
    const updatedTicket = mockTickets.find(ticket => ticket.id === ticketId);
    return { ok: true, data: updatedTicket };
    
    // Kode asli dengan Supabase
    /*
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data: updatedTicket, error } = await supabase
      .from('tickets')
      .update(data)
      .eq('id', ticketId)
      .select()
      .single();
      
    if (error) throw error;
    return { ok: true, data: updatedTicket };
    */
  } catch (error) {
    console.error('Error updating ticket:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
