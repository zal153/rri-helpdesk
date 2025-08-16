import { supabase, type UserRecord } from './supabase';
import { USING_MOCK_DATA } from './utils';
import { loginUser as mockLoginUser, registerUser as mockRegisterUser } from './dataService';

// PENTING: File ini tidak digunakan lagi karena sekarang menggunakan mock data
// Lihat file dataService.ts untuk implementasi yang digunakan
// File ini disimpan untuk referensi saja

const LS_USERS_KEY = 'registeredUsers';
const LS_CURRENT_USER_KEY = 'currentUser';

export interface RegisterPayload { name: string; nip: string; division: string; email?: string; phone?: string; password: string; }
export interface LoginPayload { nip: string; password: string; }
export interface ServiceResult<T> { ok: boolean; data?: T; error?: string; }

interface LocalStoredUser extends UserRecord { password: string; createdAt: string; }

// Fungsi selalu mengembalikan false saat menggunakan mock data
const isSupabaseReady = () => !USING_MOCK_DATA && !!supabase;

function loadLocalUsers(): LocalStoredUser[] { return JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]') as LocalStoredUser[]; }
function saveLocalUsers(users: LocalStoredUser[]) { localStorage.setItem(LS_USERS_KEY, JSON.stringify(users)); }

export function getCurrentUser(): UserRecord | null { const raw = localStorage.getItem(LS_CURRENT_USER_KEY); if (!raw) return null; try { return JSON.parse(raw) as UserRecord; } catch { return null; } }
export function logout() { localStorage.removeItem(LS_CURRENT_USER_KEY); }

// Menggunakan fungsi dari dataService.ts untuk mock data
export async function registerUser(payload: RegisterPayload): Promise<ServiceResult<UserRecord>> {
  if (USING_MOCK_DATA) {
    const result = await mockRegisterUser({
      name: payload.name,
      nip: payload.nip,
      division: payload.division,
      email: payload.email,
      phone: payload.phone,
      password: payload.password
    });
    
    // Type casting untuk menyesuaikan dengan tipe ServiceResult<UserRecord>
    return result as ServiceResult<UserRecord>;
  }

  // Kode asli menggunakan Supabase (tidak digunakan lagi)
  if (isSupabaseReady()) {
    try {
      const { data: existing } = await supabase!.from('users').select('id').eq('nip', payload.nip).maybeSingle();
      if (existing) return { ok: false, error: 'NIP sudah terdaftar' };
      const newRecord = { nip: payload.nip, name: payload.name, division: payload.division, email: payload.email, phone: payload.phone, role: 'user', password: payload.password } as const;
      const { data, error } = await supabase!.from('users').insert(newRecord).select('*').single();
      if (error || !data) return { ok: false, error: error?.message || 'Gagal menyimpan user' };
      return { ok: true, data: data as UserRecord };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Error tidak diketahui' };
    }
  }
  
  const users = loadLocalUsers();
  if (users.some(u => u.nip === payload.nip)) return { ok: false, error: 'NIP sudah terdaftar' };
  const record: LocalStoredUser = { id: `user_${payload.nip}_${Date.now()}`, nip: payload.nip, name: payload.name, division: payload.division, email: payload.email, phone: payload.phone, role: 'user', password: payload.password, createdAt: new Date().toISOString() };
  users.push(record); saveLocalUsers(users); return { ok: true, data: record };
}

// Menggunakan fungsi dari dataService.ts untuk mock data
export async function loginUser(payload: LoginPayload): Promise<ServiceResult<UserRecord>> {
  if (USING_MOCK_DATA) {
    const result = await mockLoginUser(payload.nip, payload.password);
    
    // Type casting untuk menyesuaikan dengan tipe ServiceResult<UserRecord>
    return result as ServiceResult<UserRecord>;
  }

  // Kode asli menggunakan Supabase (tidak digunakan lagi)
  if (isSupabaseReady()) {
    try {
      const { data, error } = await supabase!.from('users').select('*').eq('nip', payload.nip).maybeSingle();
      if (error) return { ok: false, error: error.message };
      if (!data) return { ok: false, error: 'NIP tidak terdaftar' };
      const pass = (data as { password?: string }).password;
      if (pass !== payload.password) return { ok: false, error: 'Password salah' };
      localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(data));
      return { ok: true, data: data as UserRecord };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Error tidak diketahui' };
    }
  }
  
  const users = loadLocalUsers();
  const user = users.find(u => u.nip === payload.nip);
  if (!user) return { ok: false, error: 'NIP tidak terdaftar' };
  if (user.password !== payload.password) return { ok: false, error: 'Password salah' };
  const sessionUser: UserRecord = { id: user.id, name: user.name, nip: user.nip, division: user.division, role: user.role, email: user.email, phone: user.phone };
  localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(sessionUser));
  return { ok: true, data: sessionUser };
}
