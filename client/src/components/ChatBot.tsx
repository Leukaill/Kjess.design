import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  MessageSquare,
  Sparkles,
  ChevronUp,
  Mail,
  Phone
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  message: string;
  isFromUser: boolean;
  timestamp: string;
}

interface ChatResponse {
  userMessage: Message;
  aiMessage: Message;
  suggestedAction?: 'contact' | 'consultation' | 'newsletter';
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat settings
  const { data: settings } = useQuery({
    queryKey: ['/api/chat/settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/chat/settings');
      return response as any;
    }
  });

  // Start conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: (data: { sessionId: string; userEmail?: string; userName?: string }) => 
      apiRequest('POST', '/api/chat/start', data),
    onSuccess: (data: any) => {
      setConversationId(data.id);
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; message: string; isFromUser: boolean }) => {
      const response = await apiRequest('POST', '/api/chat/message', data);
      return response as ChatResponse;
    },
    onSuccess: (data: ChatResponse) => {
      setMessages(prev => [...prev, data.userMessage, data.aiMessage]);
      setMessage('');
      
      // Handle suggested actions
      if (data.suggestedAction === 'contact') {
        // Could trigger a contact form modal or scroll to contact section
      } else if (data.suggestedAction === 'newsletter') {
        // Could trigger newsletter signup
      }
    }
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start conversation when chat opens
  useEffect(() => {
    if (isOpen && !conversationId && settings?.isEnabled) {
      startConversationMutation.mutate({ sessionId });
    }
  }, [isOpen, conversationId, settings?.isEnabled]);

  // Don't render if chat is disabled
  if (!settings?.isEnabled) {
    return null;
  }

  const handleSendMessage = () => {
    if (!message.trim() || !conversationId || sendMessageMutation.isPending) return;
    
    setShowWelcome(false);
    sendMessageMutation.mutate({
      conversationId,
      message: message.trim(),
      isFromUser: true
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button - Positioned next to scroll-to-top */}
      <motion.div
        className="fixed bottom-6 right-20 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 1
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              data-testid="button-open-chat"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Bot className="w-8 h-8 text-white" />
              </motion.div>
              
              {/* Floating sparkles animation */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-96 h-[600px] shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">KJESS AI Assistant</h3>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                        <span className="text-xs text-purple-100">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-white/20 p-1"
                      data-testid="button-minimize-chat"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 p-1"
                      data-testid="button-close-chat"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-0 h-[480px] flex flex-col">
                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {/* Welcome Message */}
                        <AnimatePresence>
                          {showWelcome && settings?.welcomeMessage && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-white rounded-lg p-3 shadow-sm border max-w-[280px]">
                                <p className="text-sm text-gray-800">{settings.welcomeMessage}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Chat Messages */}
                        {messages.map((msg, index) => (
                          <motion.div
                            key={`${msg.id}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start space-x-3 ${
                              msg.isFromUser ? 'flex-row-reverse space-x-reverse' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.isFromUser 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}>
                              {msg.isFromUser ? (
                                <span className="text-white text-sm font-semibold">Y</span>
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className={`rounded-lg p-3 shadow-sm border max-w-[280px] ${
                              msg.isFromUser 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                                : 'bg-white text-gray-800'
                            }`}>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${
                                msg.isFromUser ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}

                        {/* Loading indicator */}
                        {sendMessageMutation.isPending && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm border">
                              <div className="flex space-x-1">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-gray-400 rounded-full"
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ 
                                      duration: 1,
                                      repeat: Infinity,
                                      delay: i * 0.2
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area */}
                      <div className="p-4 border-t bg-white">
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <Input
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Ask me about interior design..."
                              className="border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                              disabled={sendMessageMutation.isPending || !conversationId}
                              data-testid="input-chat-message"
                            />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || sendMessageMutation.isPending || !conversationId}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                            data-testid="button-send-message"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Quick Actions */}
                        {messages.length === 0 && !sendMessageMutation.isPending && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 flex flex-wrap gap-2"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage("What services do you offer?")}
                              className="text-xs"
                              data-testid="button-quick-services"
                            >
                              Our Services
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage("How much does a consultation cost?")}
                              className="text-xs"
                              data-testid="button-quick-pricing"
                            >
                              Pricing
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage("How do I book a consultation?")}
                              className="text-xs"
                              data-testid="button-quick-booking"
                            >
                              Book Consultation
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Minimized State */}
              <AnimatePresence>
                {isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 cursor-pointer"
                    onClick={() => setIsMinimized(false)}
                  >
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">Click to expand chat</span>
                      <ChevronUp className="w-4 h-4" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;