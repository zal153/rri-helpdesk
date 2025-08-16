import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';

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

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    nip: '',
    division: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!registerForm.name || !registerForm.nip || !registerForm.division || !registerForm.password) {
      toast.error('Nama, NIP, Divisi, dan Password harus diisi');
      setIsLoading(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Password dan Konfirmasi Password tidak sama');
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = existingUsers.find((user: RegisteredUser) => user.nip === registerForm.nip);
      
      if (userExists) {
        toast.error('NIP sudah terdaftar! Silakan gunakan NIP yang berbeda.');
        setIsLoading(false);
        return;
      }

      // Create new user (in real app, password should be hashed)
      const newUser: RegisteredUser = {
        id: `user_${registerForm.nip}_${Date.now()}`,
        name: registerForm.name,
        nip: registerForm.nip,
        division: registerForm.division,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password, // In production, hash this!
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      toast.success('🎉 Pendaftaran berhasil! Silakan login dengan NIP dan password Anda.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      toast.error('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Daftar Akun Baru
          </h1>
          <p className="text-slate-600 text-lg">Buat akun untuk mengakses RRI Helpdesk</p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto"></div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">Pendaftaran User</CardTitle>
            <CardDescription className="text-slate-600">
              Isi data diri Anda untuk membuat akun baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-slate-700 font-medium">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-nip" className="text-slate-700 font-medium">
                  NIP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="register-nip"
                  type="text"
                  placeholder="Nomor Induk Pegawai"
                  value={registerForm.nip}
                  onChange={(e) => setRegisterForm({...registerForm, nip: e.target.value})}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-division" className="text-slate-700 font-medium">
                  Divisi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="register-division"
                  type="text"
                  placeholder="Nama divisi/bagian"
                  value={registerForm.division}
                  onChange={(e) => setRegisterForm({...registerForm, division: e.target.value})}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-slate-700 font-medium">
                  Email (Opsional)
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="alamat@email.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone" className="text-slate-700 font-medium">
                  No. Telepon (Opsional)
                </Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-slate-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
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

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-slate-700 font-medium">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                    className="rounded-xl border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-green-50/80 p-4 rounded-xl border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>ℹ️ Informasi:</strong><br />
                  • Field dengan tanda (*) wajib diisi<br />
                  • NIP harus unik dan belum terdaftar<br />
                  • Password minimal 6 karakter<br />
                  • Simpan baik-baik NIP dan password untuk login
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                disabled={isLoading}
              >
                {isLoading ? '⏳ Mendaftar...' : '✅ Daftar Sekarang'}
              </Button>

              <div className="text-center pt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-slate-600 hover:text-green-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Sudah punya akun? Login di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}