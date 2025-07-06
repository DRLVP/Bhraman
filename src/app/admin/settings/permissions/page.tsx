'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPermissionsPage() {
  const { adminData } = useAdminAuth();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Permissions</CardTitle>
          <CardDescription>All admin users now have full access to all features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 text-blue-800 rounded-md">
            <p className="font-medium">System Update</p>
            <p className="mt-2">The permissions system has been simplified. All admin users now have full access to all features and functionality.</p>
            <p className="mt-2">This change was made to streamline the admin experience and ensure all administrators can effectively manage the system.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}