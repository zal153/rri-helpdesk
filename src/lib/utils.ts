import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Konstanta untuk menunjukkan bahwa aplikasi menggunakan mock data
export const USING_MOCK_DATA = true;

// Fungsi untuk mendapatkan user dari localStorage
export function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Fungsi untuk format tanggal
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
