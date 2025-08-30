import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  Brain, 
  Plus, 
  Edit, 
  Trash,
  Save,
  Eye,
  Users
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const AdminChatPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKnowledgeItem, setNewKnowledgeItem] = useState({
    title: '',
    content: '',
    category: '',
    isActive: true
  });

  // Fetch chat settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/chat/settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/chat/settings');
      return response as any;
    }
  });

  // Fetch knowledge base
  const { data: knowledgeBase, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['/api/admin/chat/knowledge'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/chat/knowledge');
      return response as any[];
    }
  });

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/admin/chat/conversations'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/chat/conversations');
      return response as any[];
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', '/api/admin/chat/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/chat/settings'] });
      toast({ title: "Settings updated successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Failed to update settings", 
        description: "Please try again.",
        variant: "destructive" 
      });
    }
  });

  // Create knowledge base item mutation
  const createKnowledgeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/admin/chat/knowledge', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/chat/knowledge'] });
      setNewKnowledgeItem({ title: '', content: '', category: '', isActive: true });
      toast({ title: "Knowledge base item added successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Failed to add knowledge base item", 
        description: "Please try again.",
        variant: "destructive" 
      });
    }
  });

  // Delete knowledge base item mutation
  const deleteKnowledgeMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/chat/knowledge/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/chat/knowledge'] });
      toast({ title: "Knowledge base item deleted successfully!" });
    },
    onError: () => {
      toast({ 
        title: "Failed to delete knowledge base item", 
        description: "Please try again.",
        variant: "destructive" 
      });
    }
  });

  const handleSettingsUpdate = (field: string, value: any) => {
    if (!settings) return;
    
    const updatedSettings = {
      ...settings,
      [field]: value
    };
    
    updateSettingsMutation.mutate(updatedSettings);
  };

  const handleAddKnowledge = () => {
    if (!newKnowledgeItem.title || !newKnowledgeItem.content || !newKnowledgeItem.category) {
      toast({ 
        title: "Please fill in all fields", 
        variant: "destructive" 
      });
      return;
    }
    
    createKnowledgeMutation.mutate(newKnowledgeItem);
  };

  if (settingsLoading || knowledgeLoading || conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">AI Assistant Management</h1>
            <p className="text-blue-100">Configure and manage your website's AI chatbot</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Knowledge Base</span>
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Chat Logs</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Chatbot Configuration</span>
              </CardTitle>
              <CardDescription>
                Control how your AI assistant behaves and interacts with visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable AI Assistant</Label>
                  <p className="text-sm text-gray-600">Turn the chatbot on or off for website visitors</p>
                </div>
                <Switch
                  checked={settings?.isEnabled || false}
                  onCheckedChange={(checked) => handleSettingsUpdate('isEnabled', checked)}
                  data-testid="switch-chat-enabled"
                />
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  value={settings?.welcomeMessage || ''}
                  onChange={(e) => handleSettingsUpdate('welcomeMessage', e.target.value)}
                  placeholder="Enter the first message visitors see..."
                  className="min-h-[100px]"
                  data-testid="textarea-welcome-message"
                />
              </div>

              {/* Response Tone */}
              <div className="space-y-2">
                <Label htmlFor="tone">Response Tone</Label>
                <Select 
                  value={settings?.tone || 'professional'} 
                  onValueChange={(value) => handleSettingsUpdate('tone', value)}
                >
                  <SelectTrigger data-testid="select-tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Topic Restrictions */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Restrict to Relevant Topics</Label>
                  <p className="text-sm text-gray-600">Only allow design and service-related discussions</p>
                </div>
                <Switch
                  checked={settings?.restrictToRelevantTopics !== false}
                  onCheckedChange={(checked) => handleSettingsUpdate('restrictToRelevantTopics', checked)}
                  data-testid="switch-restrict-topics"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Knowledge Base</span>
              </CardTitle>
              <CardDescription>
                Add information for the AI to reference when helping customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Knowledge Item */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">Add New Knowledge Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="kb-title">Title</Label>
                    <Input
                      id="kb-title"
                      value={newKnowledgeItem.title}
                      onChange={(e) => setNewKnowledgeItem({...newKnowledgeItem, title: e.target.value})}
                      placeholder="e.g., Kitchen Design Process"
                      data-testid="input-knowledge-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kb-category">Category</Label>
                    <Input
                      id="kb-category"
                      value={newKnowledgeItem.category}
                      onChange={(e) => setNewKnowledgeItem({...newKnowledgeItem, category: e.target.value})}
                      placeholder="e.g., services, pricing, process"
                      data-testid="input-knowledge-category"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="kb-content">Content</Label>
                  <Textarea
                    id="kb-content"
                    value={newKnowledgeItem.content}
                    onChange={(e) => setNewKnowledgeItem({...newKnowledgeItem, content: e.target.value})}
                    placeholder="Detailed information the AI should know..."
                    className="min-h-[120px]"
                    data-testid="textarea-knowledge-content"
                  />
                </div>
                <Button
                  onClick={handleAddKnowledge}
                  disabled={createKnowledgeMutation.isPending}
                  className="w-full md:w-auto"
                  data-testid="button-add-knowledge"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Knowledge Item
                </Button>
              </div>

              {/* Existing Knowledge Items */}
              <div className="space-y-4">
                <h3 className="font-medium">Existing Knowledge Items</h3>
                {knowledgeBase && knowledgeBase.length > 0 ? (
                  <div className="grid gap-4">
                    {knowledgeBase.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{item.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              {item.isActive && (
                                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {item.content}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {/* TODO: Implement edit */}}
                              data-testid={`button-edit-knowledge-${item.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteKnowledgeMutation.mutate(item.id)}
                              disabled={deleteKnowledgeMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              data-testid={`button-delete-knowledge-${item.id}`}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No knowledge base items yet</p>
                    <p className="text-sm text-gray-400">Add information to help your AI assistant better serve customers</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Logs Tab */}
        <TabsContent value="conversations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Chat Conversations</span>
              </CardTitle>
              <CardDescription>
                View and monitor customer conversations with the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversations && conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.map((conversation: any) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {conversation.userName || conversation.userEmail || `Session ${conversation.sessionId.slice(-8)}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Started: {new Date(conversation.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={conversation.isActive ? "default" : "secondary"}>
                            {conversation.isActive ? "Active" : "Ended"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* TODO: View conversation details */}}
                            data-testid={`button-view-conversation-${conversation.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400">Customer conversations will appear here once they start chatting</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Conversations</span>
                </div>
                <p className="text-2xl font-bold mt-2">{conversations?.length || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Knowledge Items</span>
                </div>
                <p className="text-2xl font-bold mt-2">{knowledgeBase?.length || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">AI Status</span>
                </div>
                <Badge className={`mt-2 ${settings?.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {settings?.isEnabled ? 'Active' : 'Disabled'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminChatPage;