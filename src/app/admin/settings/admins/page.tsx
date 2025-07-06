'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Trash2, Edit } from 'lucide-react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  permissions: string[];
  lastLogin?: string;
}

export default function ManageAdminsPage() {
  const { adminData } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/admin');
        if (response.ok) {
          const { data } = await response.json();
          setAdmins(data);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.email || !formData.name) {
      setMessage({ type: 'error', text: 'Email and name are required' });
      return;
    }

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // In a real app, you would need to handle the clerkId differently
          // This is just a placeholder for demonstration
          clerkId: `clerk_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Admin added successfully' });
        setFormData({ email: '', name: '', phone: '' });
        setShowAddForm(false);
        
        // Refresh admin list
        const adminResponse = await fetch('/api/admin');
        if (adminResponse.ok) {
          const { data } = await adminResponse.json();
          setAdmins(data);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add admin' });
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage({ type: 'error', text: 'An error occurred while adding admin' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // All admins have full access now

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Admins</CardTitle>
            <CardDescription>View and manage admin users</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {showAddForm ? 'Cancel' : 'Add Admin'}
          </Button>
        </CardHeader>
        <CardContent>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {showAddForm && (
            <Card className="mb-6 border border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Add New Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email Address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-4">
                    Add Admin
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Full Access
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Edit Admin">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500" title="Delete Admin">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}