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

// Fungsi untuk login user menggunakan mock data
export async function loginUser(nip: string, password: string) {
  try {
    // Gunakan data statis untuk login
    const user = mockUsers.find(u => u.nip === nip);
    
    // Cek apakah user ditemukan dan password sesuai (untuk demo, anggap password = nip atau "password123")
    if (user && (password === user.nip || password === "password123")) {
      // Simpan user ke localStorage untuk simulasi session
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { ok: true, data: user };
    } else {
      return { ok: false, error: 'NIP atau password salah' };
    }
    
    // Kode asli dengan Supabase
    /*
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    // Login dengan Supabase Auth
    const { data, error } = await supabase.auth...
    */
  } catch (error) {
    console.error('Error logging in:', error);
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
    // Dapatkan user
    const user = mockUsers.find(u => u.id === ticketData.user_id);
    
    if (!user) {
      return { ok: false, error: 'User tidak ditemukan' };
    }
    
    // Buat ID tiket baru
    const newId = `ticket-${(mockTickets.length + 1).toString().padStart(3, '0')}`;
    
    // Buat tiket baru
    const newTicket: Ticket = {
      id: newId,
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority,
      status: 'open',
      user_id: ticketData.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: user.id,
        nip: user.nip,
        name: user.name,
        division: user.division,
        role: user.role as 'admin' | 'user'
      }
    };
    
    // Tambahkan tiket baru ke mock data
    mockTickets.push(newTicket);
    
    return { ok: true, data: newTicket };
    
    // Kode asli dengan Supabase
    /*
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
      .select()
      .single();
      
    if (error) throw error;
    return { ok: true, data };
    */
  } catch (error) {
    console.error('Error creating ticket:', error);
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
    // Cek apakah NIP sudah ada di mock data
    if (mockUsers.some(user => user.nip === userData.nip)) {
      return { ok: false, error: 'NIP sudah terdaftar' };
    }

    // Buat ID baru
    const newId = (mockUsers.length + 1).toString();
    
    // Buat user baru
    const newUser = {
      id: newId,
      nip: userData.nip,
      name: userData.name,
      division: userData.division,
      email: userData.email || null,
      phone: userData.phone || null,
      role: 'user',
      created_at: new Date().toISOString()
    };
    
    // Tambahkan user baru ke mock data
    mockUsers.push(newUser);
    
    return { ok: true, data: newUser };
    
    // Kode asli dengan Supabase
    /*
    if (!supabase) return { ok: false, error: 'Supabase client not configured' };
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        nip: userData.nip,
        division: userData.division,
        email: userData.email,
        phone: userData.phone,
        role: 'user',
        password: userData.password
      })
      .select()
      .single();
      
    if (error) throw error;
    return { ok: true, data };
    */
  } catch (error) {
    console.error('Error registering user:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
