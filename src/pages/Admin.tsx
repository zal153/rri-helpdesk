import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, LogOut, MessageSquare, Search, Ticket as TicketIcon, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { getUsers, getTickets, updateTicket } from '@/lib/dataService';
import type { Ticket } from '@/lib/dataService';
import type { UserRecord } from '@/lib/supabase';

// Interface for ticket response in dialog
interface TicketUpdateData {
  status: string;
  adminResponse: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check user authentication
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
        
        // Load users
        const usersResult = await getUsers();
        if (!usersResult.ok || !usersResult.data) {
          throw new Error(usersResult.error || 'Failed to load users');
        }
        setUsers(usersResult.data as UserRecord[]);

        // Load tickets
        const ticketsResult = await getTickets();
        if (!ticketsResult.ok || !ticketsResult.data) {
          throw new Error(ticketsResult.error || 'Failed to load tickets');
        }
        setTickets(ticketsResult.data);
        setFilteredTickets(ticketsResult.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    let filtered = tickets;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(search) ||
        ticket.description.toLowerCase().includes(search) ||
        ticket.user?.name.toLowerCase().includes(search) ||
        ticket.user?.nip.includes(search) ||
        ticket.user?.division.toLowerCase().includes(search)
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
    // TODO: Implement proper logout via Supabase auth
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    try {
      // Panggil fungsi updateTicket dari dataService
      const updateData = {
        status: newStatus || selectedTicket.status,
        admin_response: adminResponse || selectedTicket.admin_response
      };
      
      const result = await updateTicket(selectedTicket.id, updateData);
      
      if (!result.ok) {
        throw new Error(result.error);
      }
      
      // Refresh data tiket
      const ticketsResult = await getTickets();
      if (ticketsResult.ok && ticketsResult.data) {
        setTickets(ticketsResult.data);
      }
      
      setIsDialogOpen(false);
      setSelectedTicket(null);
      setAdminResponse('');
      setNewStatus('');
      
      toast.success('Tiket berhasil diperbarui!');
    } catch (err) {
      toast.error('Gagal memperbarui tiket');
      console.error('Error updating ticket:', err);
    }
  };

  const openTicketDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.admin_response || '');
    setNewStatus(ticket.status);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'bg-blue-500', text: 'Baru', icon: TicketIcon },
      'in_progress': { color: 'bg-yellow-500', text: 'Sedang Dikerjakan', icon: Clock },
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

  if (loading) {
    return <div className="p-8 text-center">Loading data...</div>;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-red-600">Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
              <div>
                <p className="mb-2 font-medium">Tidak dapat memuat data:</p>
                <p className="text-sm text-gray-600">{error}</p>
                {error.includes('Infinite recursion') && (
                  <p className="mt-2 text-sm">Ada masalah dengan struktur data di database. Mohon hubungi administrator.</p>
                )}
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t text-right">
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!user) {
    return <div className="p-8 text-center">Not authenticated</div>;
  }

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
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
                <TicketIcon className="h-8 w-8 text-blue-600" />
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
                  <SelectItem value="in_progress">Sedang Dikerjakan</SelectItem>
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
                <TicketIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
                            <span>
                              {ticket.user?.name || 'Pengguna tidak diketahui'} 
                              {ticket.user?.nip ? `(${ticket.user.nip})` : ''} 
                              {ticket.user?.division ? `- ${ticket.user.division}` : ''}
                            </span>
                          </div>
                          <div className="mt-1">
                            Tiket #{ticket.id ? ticket.id.slice(-8) : 'unknown'} • 
                            {ticket.category || 'Umum'} • 
                            Dibuat: {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('id-ID') : '-'}
                            {ticket.updated_at && ticket.created_at && ticket.updated_at !== ticket.created_at && (
                              <> • Diperbarui: {new Date(ticket.updated_at).toLocaleDateString('id-ID')}</>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Badge variant={
                          ticket.status === 'open' ? 'destructive' :
                          ticket.status === 'in_progress' ? 'default' :
                          'secondary'
                        }>
                          {ticket.status === 'open' ? 'Baru' : 
                           ticket.status === 'in_progress' ? 'Sedang Dikerjakan' : 
                           ticket.status === 'resolved' ? 'Selesai' : 'Ditutup'}
                        </Badge>
                        <Badge variant={
                          ticket.priority === 'high' ? 'destructive' :
                          ticket.priority === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {ticket.priority === 'high' ? 'Tinggi' : 
                           ticket.priority === 'medium' ? 'Sedang' : 
                           ticket.priority === 'low' ? 'Rendah' : 'Mendesak'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{ticket.description}</p>
                    {ticket.admin_response && (
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-green-900 mb-2 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respon Admin:
                        </h4>
                        <p className="text-green-800">{ticket.admin_response}</p>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => openTicketDialog(ticket)}
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {ticket.admin_response ? 'Update' : 'Respon'}
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
                    <strong>Pelapor:</strong> {selectedTicket.user?.name || 'Pengguna tidak diketahui'}
                    {selectedTicket.user?.nip ? ` (${selectedTicket.user.nip})` : ''}
                    {selectedTicket.user?.division ? ` - ${selectedTicket.user.division}` : ''}
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
                      <SelectItem value="in_progress">Sedang Dikerjakan</SelectItem>
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