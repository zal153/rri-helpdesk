import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogOut, Ticket, Clock, CheckCircle, AlertCircle, Users, Search, MessageSquare } from 'lucide-react';

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

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    setUser(userData);

    // Load all tickets
    const storedTickets = localStorage.getItem('tickets');
    if (storedTickets) {
      const allTickets = JSON.parse(storedTickets);
      setTickets(allTickets);
      setFilteredTickets(allTickets);
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = tickets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userNip.includes(searchTerm) ||
        ticket.userDivision.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleUpdateTicket = () => {
    if (!selectedTicket) return;

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          status: newStatus || ticket.status,
          adminResponse: adminResponse || ticket.adminResponse,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });

    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
    
    setIsDialogOpen(false);
    setSelectedTicket(null);
    setAdminResponse('');
    setNewStatus('');
    
    toast.success('Tiket berhasil diperbarui!');
  };

  const openTicketDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminResponse || '');
    setNewStatus(ticket.status);
    setIsDialogOpen(true);
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

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-600">
                Kelola semua tiket kendala teknik RRI
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
                  <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tiket Baru</p>
                  <p className="text-2xl font-bold text-gray-900">{openTickets}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{inProgressTickets}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{resolvedTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Tiket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari tiket, nama, NIP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="open">Baru</SelectItem>
                  <SelectItem value="in-progress">Sedang Dikerjakan</SelectItem>
                  <SelectItem value="resolved">Selesai</SelectItem>
                  <SelectItem value="closed">Ditutup</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="urgent">Mendesak</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Semua Tiket ({filteredTickets.length})
          </h2>
          
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tickets.length === 0 ? 'Belum ada tiket' : 'Tidak ada tiket sesuai filter'}
                </h3>
                <p className="text-gray-600">
                  {tickets.length === 0 
                    ? 'Belum ada laporan kendala teknik yang masuk'
                    : 'Coba ubah kriteria filter untuk melihat tiket lainnya'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{ticket.userName} ({ticket.userNip}) - {ticket.userDivision}</span>
                          </div>
                          <div className="mt-1">
                            Tiket #{ticket.id.slice(-8)} • {ticket.category} • 
                            Dibuat: {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                            {ticket.updatedAt !== ticket.createdAt && (
                              <> • Diperbarui: {new Date(ticket.updatedAt).toLocaleDateString('id-ID')}</>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{ticket.description}</p>
                    {ticket.adminResponse && (
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-green-900 mb-2 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respon Admin:
                        </h4>
                        <p className="text-green-800">{ticket.adminResponse}</p>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => openTicketDialog(ticket)}
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {ticket.adminResponse ? 'Update' : 'Respon'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Update Ticket Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Update Tiket</DialogTitle>
              <DialogDescription>
                Berikan respon atau update status tiket
              </DialogDescription>
            </DialogHeader>
            
            {selectedTicket && (
              <div className="space-y-4">
                {/* Ticket Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedTicket.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Pelapor:</strong> {selectedTicket.userName} ({selectedTicket.userNip}) - {selectedTicket.userDivision}
                  </p>
                  <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                </div>

                {/* Status Update */}
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Baru</SelectItem>
                      <SelectItem value="in-progress">Sedang Dikerjakan</SelectItem>
                      <SelectItem value="resolved">Selesai</SelectItem>
                      <SelectItem value="closed">Ditutup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin Response */}
                <div className="space-y-2">
                  <Label htmlFor="response">Respon Admin</Label>
                  <Textarea
                    id="response"
                    placeholder="Berikan update atau solusi untuk masalah ini..."
                    rows={4}
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleUpdateTicket}>
                    Update Tiket
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}