import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, LogOut, Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  nip: string;
  division: string;
  role: 'user' | 'admin';
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userId: string;
  userName: string;
  userNip: string;
  userDivision: string;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        navigate('/');
        return;
      }

      const userData = JSON.parse(currentUser);
      setUser(userData);

      // Load tickets for this user from Supabase
      try {
        const { getTickets } = await import('../lib/dataService');
        
        const result = await getTickets();
        if (result.ok && result.data) {
          // Filter tickets for current user
          const userTickets = result.data
            .filter(ticket => ticket.user_id === userData.id)
            .map(ticket => ({
              id: ticket.id,
              title: ticket.title,
              description: ticket.description,
              category: ticket.category,
              priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent',
              status: ticket.status as 'open' | 'in-progress' | 'resolved' | 'closed',
              userId: ticket.user_id,
              userName: ticket.user?.name || userData.name,
              userNip: ticket.user?.nip || userData.nip,
              userDivision: ticket.user?.division || userData.division,
              createdAt: ticket.created_at || '',
              updatedAt: ticket.updated_at || '',
              adminResponse: ticket.admin_response
            }));
          
          setTickets(userTickets);
        }
      } catch (error) {
        // Silent error handling
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description || !newTicket.category) {
      toast.error('Semua field harus diisi');
      return;
    }

    try {
      // Import createTicket function
      const { createTicket } = await import('../lib/dataService');
      
      const ticketData = {
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        user_id: user!.id
      };

      const result = await createTicket(ticketData);
      
      if (!result.ok) {
        throw new Error(result.error);
      }
      
      // Update local state with the new ticket
      if (result.data) {
        const newTicketForState: Ticket = {
          id: result.data.id,
          title: result.data.title,
          description: result.data.description,
          category: result.data.category,
          priority: result.data.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: result.data.status as 'open' | 'in-progress' | 'resolved' | 'closed',
          userId: result.data.user_id,
          userName: result.data.user?.name || user!.name,
          userNip: result.data.user?.nip || user!.nip,
          userDivision: result.data.user?.division || user!.division,
          createdAt: result.data.created_at || new Date().toISOString(),
          updatedAt: result.data.updated_at || new Date().toISOString(),
          adminResponse: result.data.admin_response
        };
        
        setTickets([...tickets, newTicketForState]);
      }
      
      // Reset form
      setNewTicket({
        title: '',
        description: '',
        category: '',
        priority: 'medium'
      });
      
      setIsDialogOpen(false);
      toast.success('Tiket berhasil dibuat!');
    } catch (error) {
      toast.error('Gagal membuat tiket. Silakan coba lagi.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'bg-blue-500', text: 'Baru', icon: Ticket },
      'in-progress': { color: 'bg-yellow-500', text: 'Sedang Dikerjakan', icon: Clock },
      resolved: { color: 'bg-green-500', text: 'Selesai', icon: CheckCircle },
      closed: { color: 'bg-gray-500', text: 'Ditutup', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-green-100 text-green-800', text: 'Rendah' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Sedang' },
      high: { color: 'bg-orange-100 text-orange-800', text: 'Tinggi' },
      urgent: { color: 'bg-red-100 text-red-800', text: 'Mendesak' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    
    return (
      <Badge className={config.color}>
        <AlertCircle className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard User</h1>
              <p className="text-sm text-gray-600">
                Selamat datang, {user.name} ({user.nip}) - {user.division}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ticket className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tiket</p>
                  <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sedang Proses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Terbuka</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'open').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create New Ticket Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Buat Tiket Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Buat Tiket Baru</DialogTitle>
                <DialogDescription>
                  Laporkan kendala teknik yang Anda alami
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Masalah</Label>
                  <Input
                    id="title"
                    placeholder="Ringkasan singkat masalah"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori masalah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="network">Jaringan</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="printer">Printer</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select value={newTicket.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setNewTicket({...newTicket, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                      <SelectItem value="urgent">Mendesak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Detail</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan masalah secara detail..."
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">
                    Buat Tiket
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Tiket Saya</h2>
          
          {tickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada tiket</h3>
                <p className="text-gray-600">Klik "Buat Tiket Baru" untuk melaporkan masalah</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <CardDescription>
                          Tiket #{ticket.id.slice(-8)} • {ticket.category} • 
                          Dibuat: {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{ticket.description}</p>
                    {ticket.adminResponse && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Respon Admin:</h4>
                        <p className="text-blue-800">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}