import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Image, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Eye,
  Edit,
  Trash,
  TrendingUp,
  Activity,
  Palette,
  Shield
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const queryClient = useQueryClient();

  const { data: authCheck, isError } = useQuery({
    queryKey: ['/api/admin/check'],
    queryFn: () => apiRequest('GET', '/api/admin/check'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (isError || !authCheck) {
      setLocation('/admin/login');
    }
  }, [authCheck, isError, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/admin/logout', {});
      queryClient.clear();
      setLocation('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      href: '/admin/dashboard',
      description: 'Dashboard overview'
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: Image,
      href: '/admin/gallery',
      description: 'Manage gallery images'
    },
    {
      id: 'content',
      label: 'Content',
      icon: FileText,
      href: '/admin/content',
      description: 'Edit website content'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      href: '/admin/contacts',
      description: 'View contact submissions'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: Mail,
      href: '/admin/newsletter',
      description: 'Manage subscribers'
    }
  ];

  const currentPath = window.location.pathname;

  if (!authCheck) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-semibold text-lg">Admin Panel</h1>
                  <p className="text-sm text-white/60">KJESS Designs</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500">
                <AvatarFallback className="bg-transparent text-white font-semibold">
                  {(authCheck as any)?.admin?.username?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{(authCheck as any)?.admin?.username || 'Administrator'}</p>
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300 border-green-500/30">
                  Online
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.href;
                const Icon = item.icon;
                
                return (
                  <motion.li key={item.id} whileHover={{ x: 4 }}>
                    <button
                      onClick={() => setLocation(item.href)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-red-500/20 justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                System Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { data: contacts } = useQuery({
    queryKey: ['/api/contacts'],
    queryFn: () => apiRequest('GET', '/api/contacts', {}),
  });

  const { data: newsletters } = useQuery({
    queryKey: ['/api/newsletters'],
    queryFn: () => apiRequest('GET', '/api/newsletters', {}),
  });

  const { data: galleryImages } = useQuery({
    queryKey: ['/api/gallery/public'],
    queryFn: async () => {
      const response = await fetch('/api/gallery/public');
      if (response.ok) {
        return await response.json();
      }
      return [];
    },
  });

  const stats = [
    {
      title: 'Gallery Images',
      value: Array.isArray(galleryImages) ? galleryImages.length : 0,
      icon: Image,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Contact Messages',
      value: Array.isArray(contacts) ? contacts.length : 0,
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Newsletter Subscribers',
      value: Array.isArray(newsletters) ? newsletters.length : 0,
      icon: Mail,
      color: 'from-purple-500 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Active Sessions',
      value: 1,
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      change: 'Active'
    }
  ];

  const recentActivity = [
    { action: 'New contact message received', time: '2 minutes ago', type: 'contact' },
    { action: 'Gallery image uploaded', time: '1 hour ago', type: 'gallery' },
    { action: 'Newsletter subscription', time: '3 hours ago', type: 'newsletter' },
    { action: 'Content updated', time: '1 day ago', type: 'content' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg"
        >
          <h1 className="text-2xl font-bold mb-2">Welcome back, Administrator!</h1>
          <p className="text-purple-100">
            Manage your KJESS Designs website with ease. Here's what's happening today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates from your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Common tasks to manage your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Gallery Image
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit About Content
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Website
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;