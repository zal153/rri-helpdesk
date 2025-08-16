import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/utils';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ 
  element, 
  requiredRole = null, 
  redirectPath = '/login'
}: { 
  element: JSX.Element, 
  requiredRole?: 'admin' | 'user' | null, 
  redirectPath?: string 
}) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirect admin to admin page, users to dashboard
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  return element;
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize any required resources or checks
  useEffect(() => {
    // Check mock users in localStorage
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (!registeredUsers) {
      localStorage.setItem('registeredUsers', JSON.stringify([]));
    }
    
    setIsInitialized(true);
  }, []);
  
  if (!isInitialized) {
    return <div>Loading application...</div>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute element={<Dashboard />} />} 
            />
            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<Admin />} requiredRole="admin" />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
