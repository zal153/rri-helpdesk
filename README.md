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
