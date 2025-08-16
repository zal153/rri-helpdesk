import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

interface User {
  id: string;
  name: string;
  nip: string;
  division: string;
  role: 'user' | 'admin';
}

interface RegisteredUser {
  id: string;
  name: string;
  nip: string;
  division: string;
  email?: string;
  phone?: string;
  password: string;
  createdAt: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // User login form
  const [userForm, setUserForm] = useState({
    nip: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Admin login form
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  });

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userForm.nip || !userForm.password) {
      toast.error('NIP dan Password harus diisi');
      setIsLoading(false);
      return;
    }

    try {
      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find((u: RegisteredUser) => u.nip === userForm.nip);

      if (registeredUser) {
        // Verify password
        if (registeredUser.password !== userForm.password) {
          toast.error('Password salah! Silakan coba lagi.');
          setIsLoading(false);
          return;
        }

        // Create user session with registered data
        const user: User = {
          id: registeredUser.id,
          name: registeredUser.name,
          nip: registeredUser.nip,
          division: registeredUser.division,
          role: 'user'
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success(`🎉 Selamat datang kembali, ${registeredUser.name}!`);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error('NIP tidak terdaftar! Silakan daftar terlebih dahulu atau periksa kembali NIP Anda.', {
          description: 'Klik "Belum punya akun? Daftar di sini" untuk membuat akun baru.'
        });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login. Silakan coba lagi.');
    }

    setIsLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication (in real app, this would be validated against database)
    if (adminForm.username === 'admin' && adminForm.password === 'admin123') {
      const admin: User = {
        id: 'admin_1',
        name: 'Administrator',
        nip: 'ADMIN001',
        division: 'IT Support',
        role: 'admin'
      };

      localStorage.setItem('currentUser', JSON.stringify(admin));
      toast.success('Login admin berhasil!');
      
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } else {
      toast.error('Username atau password salah');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-2xl">RRI</div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            RRI Helpdesk
          </h1>
          <p className="text-slate-600 text-lg">Sistem Pelaporan Kendala Teknik</p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="user" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
              👤 User
            </TabsTrigger>
            <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
              🔐 Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800">Login User</CardTitle>
                <CardDescription className="text-slate-600">
                  Masukkan data diri Anda untuk melanjutkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nip" className="text-slate-700 font-medium">NIP</Label>
                    <Input
                      id="nip"
                      type="text"
                      placeholder="Nomor Induk Pegawai"
                      value={userForm.nip}
                      onChange={(e) => setUserForm({...userForm, nip: e.target.value})}
                      className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password" className="text-slate-700 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="user-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]" disabled={isLoading}>
                    {isLoading ? '⏳ Loading...' : '🚀 Login'}
                  </Button>
                  
                  <div className="text-center pt-4">
                    <Link 
                      to="/register" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Belum punya akun? Daftar di sini
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800">Login Admin</CardTitle>
                <CardDescription className="text-slate-600">
                  Masukkan username dan password admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username admin"
                      value={adminForm.username}
                      onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                      className="rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password admin"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                      className="rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="text-sm text-slate-600 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                    <strong className="text-slate-800">🔑 Demo Credentials:</strong><br />
                    <span className="text-blue-600 font-mono">Username: admin</span><br />
                    <span className="text-blue-600 font-mono">Password: admin123</span>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]" disabled={isLoading}>
                    {isLoading ? '⏳ Loading...' : '🔐 Login Admin'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}