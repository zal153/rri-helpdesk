# 🎧 RRI Helpdesk System

Sistem Helpdesk untuk Radio Republik Indonesia (RRI) - Aplikasi untuk mengelola tiket kendala teknik dan pelaporan masalah.

## 🚀 Fitur Utama

- **Dashboard User**: Membuat dan melacak tiket kendala teknik
- **Dashboard Admin**: Mengelola semua tiket dan memberikan response
- **Real-time Updates**: Sinkronisasi data menggunakan Supabase
- **Role-based Access**: Akses berbeda untuk user dan admin
- **Responsive Design**: Tampilan yang adaptif untuk berbagai perangkat

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router
- **State Management**: React Hooks
- **Notifications**: Sonner Toast

## ⚙️ Setup & Installation

### 1. Prerequisites
```bash
- Node.js (v18+)
- npm atau pnpm
- Account Supabase
```

### 2. Clone Repository
```bash
git clone https://github.com/zal153/rri-helpdesk.git
cd rri-helpdesk
```

### 3. Install Dependencies
```bash
npm install
# atau
pnpm install
```

### 4. Environment Setup
Buat file `.env.local` di root project:
```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 5. Database Setup
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka **SQL Editor**
4. Copy paste dan jalankan script berikut:

```sql
-- DISABLE RLS sementara untuk testing
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tickets DISABLE ROW LEVEL SECURITY;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nip varchar(50) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  division varchar(255) NOT NULL,
  email varchar(255),
  phone varchar(50),
  password varchar(255) NOT NULL,
  role varchar(20) NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(500) NOT NULL,
  description text NOT NULL,
  category varchar(100) NOT NULL,
  priority varchar(20) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'open',
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert sample data
INSERT INTO public.users (nip, name, division, email, phone, password, role)
VALUES
  ('123456', 'Admin Utama', 'IT', 'admin@rri.co.id', '08123456789', '123456', 'admin'),
  ('234567', 'Teknisi Studio', 'Teknik', 'teknisi@rri.co.id', '08234567890', '234567', 'user'),
  ('345678', 'Reporter Berita', 'Pemberitaan', 'reporter@rri.co.id', '08345678901', '345678', 'user'),
  ('456789', 'Penyiar Senior', 'Siaran', 'penyiar@rri.co.id', '08456789012', '456789', 'user')
ON CONFLICT (nip) DO NOTHING;

-- Insert sample tickets
INSERT INTO public.tickets (title, description, category, priority, status, user_id, admin_response)
VALUES
  (
    'Mikrophone Studio 3 Bermasalah',
    'Mikrophone di studio 3 menghasilkan suara mendengung dan tidak jernih saat digunakan untuk siaran.',
    'hardware',
    'high',
    'open',
    (SELECT id FROM public.users WHERE nip = '234567'),
    NULL
  ),
  (
    'Komputer Editing Lambat',
    'PC untuk editing audio di ruang produksi sangat lambat, menghambat proses editing program.',
    'software',
    'medium',
    'in_progress',
    (SELECT id FROM public.users WHERE nip = '345678'),
    'Sedang dalam pengecekan hardware, kemungkinan perlu upgrade RAM.'
  )
ON CONFLICT DO NOTHING;
```

### 6. Run Application
```bash
npm run dev
# atau
npm dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

## 🔐 Default Credentials

### Admin Access
- **NIP**: `123456`
- **Password**: `123456` atau `password123`
- **URL**: `http://localhost:5173/admin`

### User Access
- **NIP**: `234567` (Teknisi Studio)
- **Password**: `234567` atau `password123`
- **NIP**: `345678` (Reporter Berita)  
- **Password**: `345678` atau `password123`
- **NIP**: `456789` (Penyiar Senior)
- **Password**: `456789` atau `password123`
- **URL**: `http://localhost:5173/dashboard`

## 🎯 Cara Penggunaan

### Sebagai User:
1. Login dengan credentials user
2. Klik "Buat Tiket Baru" di dashboard
3. Isi form dengan detail masalah
4. Submit dan tunggu response dari admin
5. Cek status tiket di halaman "Tiket Saya"

### Sebagai Admin:
1. Login dengan credentials admin
2. Lihat semua tiket di dashboard admin
3. Filter tiket berdasarkan status/prioritas
4. Klik tiket untuk memberikan response
5. Update status tiket (open → in_progress → resolved)

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `nip` (String, Unique)
- `name` (String)
- `division` (String) 
- `email` (String, Optional)
- `phone` (String, Optional)
- `password` (String)
- `role` (admin/user)
- `created_at`, `updated_at`

### Tickets Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `category` (hardware/software/network/etc)
- `priority` (low/medium/high/urgent)
- `status` (open/in_progress/resolved/closed)
- `user_id` (Foreign Key to Users)
- `admin_response` (Text, Optional)
- `created_at`, `updated_at`

## 🚨 Troubleshooting

### "Supabase client not configured"
1. Periksa file `.env.local` sudah dibuat
2. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY benar
3. Restart aplikasi dengan `npm run dev`

### Login gagal
1. Pastikan SQL script sudah dijalankan di Supabase
2. Cek credentials menggunakan NIP, bukan username
3. Periksa console browser untuk error details

### Data tidak sinkron
1. Pastikan RLS disabled untuk testing
2. Cek koneksi internet
3. Verifikasi Supabase project status

## 📞 Support

Untuk pertanyaan atau bantuan:
- **Email**: support@rri.co.id
- **GitHub Issues**: [Create Issue](https://github.com/zal153/rri-helpdesk/issues)

## 📄 License

MIT License - Lihat file `LICENSE` untuk detail lengkap.

---

**Dibuat dengan ❤️ untuk Radio Republik Indonesia**

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
npm i
```

**Start Preview**

```shell
npm run dev
```

**To build**

```shell
npm run build
```
