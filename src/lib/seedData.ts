import { supabase } from './supabase';

export async function seedDummyData() {
  if (!supabase) return { ok: false, error: 'Supabase client not configured' };

  try {
    // Insert dummy users
    const { data: users, error: userError } = await supabase
      .from('users')
      .insert([
        {
          nip: '123456',
          name: 'Admin Utama',
          division: 'IT',
          email: 'admin@rri.co.id',
          phone: '08123456789',
          password: 'admin123',
          role: 'admin'
        },
        {
          nip: '234567',
          name: 'Teknisi Studio',
          division: 'Teknik Studio',
          email: 'teknisi@rri.co.id',
          phone: '08234567890',
          password: 'test123',
          role: 'user'
        }
      ])
      .select();

    if (userError) throw userError;

    // Insert dummy tickets (using first user as reference)
    if (users?.[0]) {
      const { error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            title: 'Mikrophone Studio 3 Bermasalah',
            description: 'Mikrophone di studio 3 menghasilkan suara mendengung dan tidak jernih saat digunakan untuk siaran.',
            category: 'Peralatan Studio',
            priority: 'high',
            status: 'open',
            user_id: users[0].id
          },
          {
            title: 'Komputer Editing Lambat',
            description: 'PC untuk editing audio di ruang produksi sangat lambat, menghambat proses editing program.',
            category: 'Komputer & Software',
            priority: 'medium',
            status: 'in_progress',
            user_id: users[0].id,
            admin_response: 'Sedang dalam pengecekan hardware, kemungkinan perlu upgrade RAM.'
          }
        ]);

      if (ticketError) throw ticketError;
    }

    return { ok: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Unknown error during seeding' 
    };
  }
}

// Untuk test seeding dari browser console:
// import('/src/lib/seedData.ts').then(m => m.seedDummyData()).then(console.log)
