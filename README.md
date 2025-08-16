# RRI Helpdesk System

## Technology Stack

Sistem ini dibangun dengan:

- Vite
- TypeScript
- React
- shadcn-ui (UI Components)
- Tailwind CSS
- React Router v6
- React Query

## Tentang Project

RRI Helpdesk System adalah sistem pelaporan kendala teknik untuk Radio Republik Indonesia. Sistem ini memiliki fitur:

- Login untuk user dan admin
- Registrasi pengguna baru
- Dashboard user untuk melihat dan membuat tiket
- Dashboard admin untuk mengelola tiket
- Fitur update status dan respon tiket

## PENTING: Menggunakan Mock Data

> **Catatan**: Project ini saat ini menggunakan mock data dan tidak terhubung dengan Supabase backend karena adanya masalah pada security policy Supabase.

### Kredensial Demo

**User:**
- NIP: 234567
- Password: password123

**Admin:**
- Username: admin
- Password: admin123

## Konfigurasi Database

Aplikasi ini menggunakan Supabase sebagai database dan autentikasi. Untuk mengkonfigurasi koneksi database:

1. Buat file `.env.local` di root project dengan isi:
   ```
   VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Ganti nilai-nilai tersebut dengan URL dan kunci anonim dari project Supabase Anda sendiri.

## Setting Supabase

Untuk mengatur database Supabase yang diperlukan:

1. Buat akun di [Supabase](https://supabase.com) jika belum punya
2. Buat project baru di Supabase
3. Salin URL dan Anon Key dari halaman Settings > API di dashboard Supabase
4. Buat tabel-tabel berikut di database Supabase:

### Tabel `users`

```sql
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  nip text unique not null,
  name text not null,
  division text,
  email text unique,
  phone text,
  role text default 'user' not null,
  created_at timestamp with time zone default now() not null
);

-- Pastikan Row Level Security (RLS) diaktifkan
alter table public.users enable row level security;

-- Buat policy untuk mengakses data users
create policy "Allow public read access" 
on public.users for select 
using (true);

create policy "Allow individual update" 
on public.users for update 
using (auth.uid() = id);
```

### Tabel `tickets`

```sql
create table public.tickets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  priority text not null,
  status text default 'open' not null,
  user_id uuid references public.users(id) not null,
  admin_response text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Aktifkan RLS
alter table public.tickets enable row level security;

-- Buat policy untuk tickets
create policy "Users can view their own tickets" 
on public.tickets for select 
using (auth.uid() = user_id);

create policy "Users can insert their own tickets" 
on public.tickets for insert 
with check (auth.uid() = user_id);

create policy "Admin can view all tickets" 
on public.tickets for select 
using ((select role from public.users where id = auth.uid()) = 'admin');

create policy "Admin can update all tickets" 
on public.tickets for update 
using ((select role from public.users where id = auth.uid()) = 'admin');
```

## Konfigurasi Autentikasi

1. Di dashboard Supabase, pergi ke Authentication > Settings
2. Pastikan Email Auth Provider diaktifkan
3. Konfigurasi SMTP jika ingin menggunakan fitur verifikasi email

Untuk autentikasi password sederhana:

1. Di Authentication > Settings > Email, matikan "Confirm email" jika Anda tidak memerlukan verifikasi email untuk testing
2. Untuk lingkungan produksi, sangat disarankan untuk mengaktifkan verifikasi email

## Menggunakan Mock Data vs Supabase

Project ini mendukung dua mode operasi:

### Mode Mock Data (untuk development cepat)

Data mock sudah tersedia di `src/lib/dataService.ts`. Untuk menggunakan mode ini:

1. Buka file `src/lib/utils.ts`
2. Pastikan konstanta `USING_MOCK_DATA` di-set ke `true`

### Mode Supabase (untuk produksi)

1. Setelah Anda mengkonfigurasi Supabase, ubah konstanta `USING_MOCK_DATA` di `src/lib/utils.ts` ke `false`
2. Pastikan file `.env.local` sudah berisi kredensial Supabase yang benar

## Troubleshooting

### Error "Infinite recursion detected in policy for relation"

Error ini biasanya terjadi karena masalah dengan policy Supabase. Solusi:

1. Periksa kebijakan (policy) untuk tabel yang disebutkan dalam error
2. Pastikan tidak ada kebijakan yang secara rekursif mereferensikan dirinya sendiri
3. Jika masalah tetap berlanjut, coba aktifkan mode mock data untuk development

### Error 500 saat mengakses API Supabase

1. Periksa apakah kredensial Supabase Anda benar
2. Periksa apakah tabel dan skema database sudah dibuat dengan benar
3. Periksa log di dashboard Supabase untuk informasi lebih detail

## File Structure

- `/src/components/ui/` - Semua komponen shadcn/ui
- `/src/lib/` - Utilitas, service, dan konfigurasi
- `/src/pages/` - Halaman utama aplikasi
- `/src/hooks/` - Custom React hooks

## Development

### Perbaikan yang Dilakukan

- Mengatasi masalah "infinite recursion detected in policy for relation 'users'" dengan menggunakan mock data
- Mengimplementasikan autentikasi berbasis localStorage
- Menerapkan protected routes
- Memperbaiki tipe data dan struktur komponen

### File Kunci

- `src/lib/dataService.ts` - Mock data dan fungsi untuk operasi data
- `src/lib/utils.ts` - Utilitas untuk manipulasi data dan sesi
- `src/App.tsx` - Implementasi protected routes

## Note

Pengalihan dari Supabase ke mock data dilakukan untuk mengatasi masalah koneksi database. Untuk implementasi sesungguhnya, perlu diperbaiki konfigurasi Supabase RLS policies.

## Deploy ke GitHub Pages

1. Pastikan repo sudah ada di GitHub (branch `main`).
2. File workflow sudah disediakan di `.github/workflows/deploy.yml`.
3. Masuk ke Settings → Pages → pilih Source: `GitHub Actions` (kalau belum otomatis).
4. Setiap push ke `main` akan build dan deploy ke Pages.
5. URL akses: `https://<username>.github.io/rri-helpdesk/` (ganti `<username>` sesuai akun).

Jika nama repo berbeda, ubah properti `base` di `vite.config.ts` menyesuaikan: `base: '/nama-repo/'`.

Custom domain: tambahkan file `public/CNAME` lalu isi domain Anda, commit, dan atur DNS (A / CNAME) sesuai dokumentasi GitHub Pages.

# Deployment

Saat men-deploy aplikasi:

1. Pastikan untuk menggunakan mode Supabase (bukan mock data)
2. Gunakan variabel lingkungan untuk menyimpan kredensial Supabase
3. Jika menggunakan Vercel, Netlify, atau platform serupa, tambahkan variabel lingkungan berikut:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```
