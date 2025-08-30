import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Search,
  Filter,
  Download,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const AdminContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simple fetch for contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contacts');
        const data = await response.json();
        console.log('Fetched contacts:', data);
        setContacts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact: Contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportContacts = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Message', 'Date'],
      ...filteredContacts.map((contact: Contact) => [
        contact.name,
        contact.email,
        contact.phone,
        contact.message.replace(/\n/g, ' '),
        format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.map((field: any) => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
            <p className="text-gray-600 mt-1">Manage and respond to customer inquiries</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Users className="w-3 h-3 mr-1" />
              {filteredContacts.length} contacts
            </Badge>
            <Button variant="outline" size="sm" onClick={exportContacts}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts by name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredContacts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No contacts match your search criteria.' : 'No contact submissions yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredContacts.map((contact: Contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedContact?.id === contact.id ? 'ring-2 ring-purple-500 shadow-md' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {format(new Date(contact.createdAt), 'MMM dd, yyyy')}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {contact.message}
                          </p>
                        </div>
                        
                        <MessageSquare className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Contact Detail Panel */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Contact Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedContact.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                          {selectedContact.email}
                        </a>
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                            {selectedContact.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(selectedContact.createdAt), 'PPP at p')}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: Your inquiry`)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply via Email
                    </Button>
                    {selectedContact.phone && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(`tel:${selectedContact.phone}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a contact</h3>
                  <p className="text-gray-600">
                    Choose a contact from the list to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;