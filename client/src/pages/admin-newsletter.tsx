import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Users, 
  Calendar,
  Search,
  Download,
  Send,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
}

const AdminNewsletter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  // Fetch newsletter subscriptions
  const { data: newslettersData, isLoading } = useQuery({
    queryKey: ['/api/newsletters'],
    queryFn: () => apiRequest('GET', '/api/newsletters', {}),
  });

  // Ensure newsletters is always an array
  const newsletters = Array.isArray(newslettersData) ? newslettersData : [];

  // Filter newsletters based on search term
  const filteredNewsletters = newsletters.filter((newsletter: Newsletter) =>
    newsletter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get subscription stats
  const totalSubscribers = newsletters.length;
  const recentSubscribers = newsletters.filter((newsletter: Newsletter) => {
    const subscriptionDate = new Date(newsletter.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return subscriptionDate > weekAgo;
  }).length;

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Subscription Date'],
      ...filteredNewsletters.map((newsletter: Newsletter) => [
        newsletter.email,
        format(new Date(newsletter.createdAt), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.map((field: any) => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const composeNewsletter = () => {
    const emailList = filteredNewsletters.map((newsletter: Newsletter) => newsletter.email).join(',');
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(emailContent);
    
    window.open(`mailto:?bcc=${emailList}&subject=${subject}&body=${body}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <p className="text-gray-600 mt-1">Manage your email subscriber list</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              {recentSubscribers} new this week
            </Badge>
            <Button variant="outline" size="sm" onClick={exportSubscribers}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => setShowCompose(!showCompose)}>
              <Send className="w-4 h-4 mr-2" />
              Compose Newsletter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSubscribers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{recentSubscribers}</p>
                </div>
                <UserPlus className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSubscribers > 0 ? Math.round((recentSubscribers / totalSubscribers) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compose Newsletter */}
        {showCompose && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Compose Newsletter</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                  <Input
                    placeholder="Newsletter subject line..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
                  <Textarea
                    placeholder="Write your newsletter content here..."
                    rows={8}
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    This will be sent to {filteredNewsletters.length} subscribers
                  </p>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setShowCompose(false)}>
                      Cancel
                    </Button>
                    <Button onClick={composeNewsletter} disabled={!emailSubject || !emailContent}>
                      <Send className="w-4 h-4 mr-2" />
                      Open in Email Client
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subscribers by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Subscribers ({filteredNewsletters.length})</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {filteredNewsletters.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'No subscribers match your search criteria.' : 'No newsletter subscribers yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNewsletters.map((newsletter: Newsletter, index: number) => (
                  <motion.div
                    key={newsletter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{newsletter.email}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Subscribed {format(new Date(newsletter.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`mailto:${newsletter.email}`)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNewsletter;