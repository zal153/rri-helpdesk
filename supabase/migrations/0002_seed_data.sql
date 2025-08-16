-- Seed initial data for testing
-- Run this in Supabase SQL Editor or via CLI: npx supabase db push

-- Insert dummy users
INSERT INTO public.users (nip, name, division, email, phone, password, role)
VALUES
  ('123456', 'Admin Utama', 'IT', 'admin@rri.co.id', '08123456789', 'admin123', 'admin'),
  ('234567', 'Teknisi Studio', 'Teknik Studio', 'teknisi@rri.co.id', '08234567890', 'test123', 'user'),
  ('345678', 'Reporter Berita', 'Pemberitaan', 'reporter@rri.co.id', '08345678901', 'test123', 'user'),
  ('456789', 'Penyiar Senior', 'Siaran', 'penyiar@rri.co.id', '08456789012', 'test123', 'user');

-- Insert dummy tickets
INSERT INTO public.tickets (title, description, category, priority, status, user_id, admin_response)
VALUES
  (
    'Mikrophone Studio 3 Bermasalah',
    'Mikrophone di studio 3 menghasilkan suara mendengung dan tidak jernih saat digunakan untuk siaran.',
    'Peralatan Studio',
    'high',
    'open',
    (SELECT id FROM public.users WHERE nip = '234567'),
    NULL
  ),
  (
    'Komputer Editing Lambat',
    'PC untuk editing audio di ruang produksi sangat lambat, menghambat proses editing program.',
    'Komputer & Software',
    'medium',
    'in_progress',
    (SELECT id FROM public.users WHERE nip = '345678'),
    'Sedang dalam pengecekan hardware, kemungkinan perlu upgrade RAM.'
  ),
  (
    'AC Studio 1 Tidak Dingin',
    'AC di studio 1 tidak mengeluarkan udara dingin, ruangan menjadi pengap saat siaran.',
    'Fasilitas',
    'high',
    'resolved',
    (SELECT id FROM public.users WHERE nip = '456789'),
    'AC sudah dibersihkan dan diisi ulang freon. Sudah berfungsi normal kembali.'
  ),
  (
    'Software Adobe Audition Error',
    'Adobe Audition sering crash saat editing multi-track, file project tidak tersimpan.',
    'Komputer & Software',
    'medium',
    'open',
    (SELECT id FROM public.users WHERE nip = '234567'),
    NULL
  );
