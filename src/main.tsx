import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { USING_MOCK_DATA } from './lib/utils';

// Log info untuk developer tentang penggunaan mock data
if (USING_MOCK_DATA) {
  console.info(
    '%c📢 RRI Helpdesk menggunakan mock data! 📢\n' +
    'Login Credentials:\n' +
    '- User: NIP=234567, Password=password123\n' +
    '- Admin: Username=admin, Password=admin123',
    'background: #ffeeba; color: #856404; font-weight: bold; padding: 5px; border-radius: 5px;'
  );
}

createRoot(document.getElementById('root')!).render(<App />);
