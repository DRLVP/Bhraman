'use client';

import { useState } from 'react';
import { Bell, Lock, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock user settings data
const mockUserSettings = {
  notifications: {
    email: true,
    sms: false,
    promotions: true,
    updates: true,
    bookingReminders: true,
  },
  preferences: {
    language: 'english',
    currency: 'inr',
    timezone: 'Asia/Kolkata',
  },
  paymentMethods: [
    {
      id: 'card1',
      type: 'credit',
      cardNumber: '**** **** **** 4242',
      expiryDate: '12/25',
      isDefault: true,
    },
  ],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockUserSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Handle notification toggle
  const handleNotificationToggle = (key: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key as keyof typeof settings.notifications],
      },
    });
  };

  // Handle preference change
  const handlePreferenceChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    });
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    // In a real application, you would call an API to change the password
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // In a real application, you would call an API to save the settings
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or notification
    }, 1000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
              <p className="text-sm text-gray-500">Manage how you receive notifications</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-xs text-gray-500">Receive booking confirmations and updates via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.email} 
                    onCheckedChange={() => handleNotificationToggle('email')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-xs text-gray-500">Receive booking confirmations and updates via SMS</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.sms} 
                    onCheckedChange={() => handleNotificationToggle('sms')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Promotional Emails</h3>
                    <p className="text-xs text-gray-500">Receive special offers and promotions</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.promotions} 
                    onCheckedChange={() => handleNotificationToggle('promotions')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Product Updates</h3>
                    <p className="text-xs text-gray-500">Receive updates about new features and improvements</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.updates} 
                    onCheckedChange={() => handleNotificationToggle('updates')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Booking Reminders</h3>
                    <p className="text-xs text-gray-500">Receive reminders about upcoming bookings</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.bookingReminders} 
                    onCheckedChange={() => handleNotificationToggle('bookingReminders')} 
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              <p className="text-sm text-gray-500">Manage your password and account security</p>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Login Sessions</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Current Session</p>
                      <p className="text-xs text-gray-500">Windows • Chrome • Mumbai, India</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
              <p className="text-sm text-gray-500">Manage your account preferences</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bengali">Bengali</option>
                  <option value="tamil">Tamil</option>
                  <option value="telugu">Telugu</option>
                </select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={settings.preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="inr">Indian Rupee (₹)</option>
                  <option value="usd">US Dollar ($)</option>
                  <option value="eur">Euro (€)</option>
                  <option value="gbp">British Pound (£)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  value={settings.preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="Asia/Kolkata">India Standard Time (IST)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
              <p className="text-sm text-gray-500">Manage your saved payment methods</p>
            </div>
            <div className="p-6">
              {settings.paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {settings.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {method.type.charAt(0).toUpperCase() + method.type.slice(1)} Card
                          </p>
                          <p className="text-xs text-gray-500">{method.cardNumber}</p>
                          <p className="text-xs text-gray-500">Expires: {method.expiryDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {method.isDefault && (
                          <span className="mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="mt-4">
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Methods</h3>
                  <p className="text-gray-500 mb-4">You haven't added any payment methods yet.</p>
                  <Button>
                    Add Payment Method
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}