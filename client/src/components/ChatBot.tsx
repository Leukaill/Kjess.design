import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  X, 
  Minimize2, 
  MessageSquare,
  ChevronUp,
  Mail,
  Phone
} from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  message: string;
  isFromUser: boolean;
  timestamp: string;
  actionButton?: {
    type: 'whatsapp' | 'contact' | 'phone';
    label: string;
    action: string;
  };
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
      return await response.json() as any;
    }
  });

  // Start conversation mutation
  const startConversationMutation = useMutation({
    mutationFn: async (data: { sessionId: string; userEmail?: string; userName?: string }) => {
      const response = await apiRequest('POST', '/api/chat/start', data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      setConversationId(data.id);
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; message: string; isFromUser: boolean }) => {
      const response = await apiRequest('POST', '/api/chat/message', data);
      return await response.json() as ChatResponse;
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

  const handleActionButton = (button: { type: 'whatsapp' | 'contact' | 'phone'; label: string; action: string }) => {
    if (button.type === 'whatsapp') {
      window.open(button.action, '_blank');
    } else if (button.type === 'phone') {
      window.location.href = button.action;
    } else if (button.type === 'contact') {
      // Scroll to contact section
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Chat Button - Responsive and elegant */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-6 md:right-20 z-[100]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1.2
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={() => setIsOpen(true)}
              className="group relative w-16 h-16 bg-[#2E2E2E] hover:bg-[#1A1A1A] rounded-full shadow-xl flex items-center justify-center transition-all duration-500 border border-[#3A3A3A] hover:border-[#4A4A4A]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              data-testid="button-open-chat"
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <MessageSquare className="w-7 h-7 text-white group-hover:text-blue-200 transition-colors duration-300" />
              </motion.div>
              
              {/* Elegant pulse indicator */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-2 right-2 sm:right-4 md:bottom-4 md:right-6 z-[100] max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-none"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-[90vw] max-w-[350px] sm:w-[350px] md:w-96 h-[70vh] max-h-[500px] md:h-[600px] shadow-2xl border border-[#E5E5E5] overflow-hidden bg-white backdrop-blur-sm">
              {/* Header - Elegant KJESS Design */}
              <CardHeader className="bg-[#2E2E2E] text-white p-5 border-b border-[#3A3A3A]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                      <MessageSquare className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium tracking-wide">Jasper</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-300 font-light">Ready to help</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
                      data-testid="button-minimize-chat"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false);
                        setIsMinimized(false);
                        setMessages([]);
                        setShowWelcome(true);
                      }}
                      className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300"
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
                    <CardContent className="p-0 h-[calc(70vh-120px)] max-h-[400px] md:h-[480px] flex flex-col">
                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#FAFAFA] to-white">
                        {/* Welcome Message */}
                        <AnimatePresence>
                          {showWelcome && settings?.welcomeMessage && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-9 h-9 bg-[#2E2E2E] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 max-w-[calc(90vw-120px)] sm:max-w-[280px]">
                                <p className="text-sm text-[#2E2E2E] font-light leading-relaxed">{settings.welcomeMessage}</p>
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
                            {!msg.isFromUser && (
                              <div className="w-8 h-8 bg-[#2E2E2E] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                              </div>
                            )}
                            <div className={`rounded-2xl p-4 shadow-md border max-w-[calc(90vw-120px)] sm:max-w-[280px] ${
                              msg.isFromUser 
                                ? 'bg-[#2E2E2E] text-white rounded-br-md border-gray-300' 
                                : 'bg-white text-[#2E2E2E] rounded-bl-md border-gray-100'
                            }`}>
                              <p className="text-sm font-light leading-relaxed">{msg.message}</p>
                              
                              {/* Action Button */}
                              {msg.actionButton && !msg.isFromUser && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <Button
                                    onClick={() => handleActionButton(msg.actionButton!)}
                                    className={`w-full flex items-center justify-center space-x-2 rounded-xl transition-all duration-300 ${
                                      msg.actionButton.type === 'whatsapp' 
                                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                                        : msg.actionButton.type === 'phone'
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-bronze hover:bg-bronze/90 text-white shadow-lg hover:shadow-xl'
                                    }`}
                                    size="sm"
                                  >
                                    {msg.actionButton.type === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
                                    {msg.actionButton.type === 'phone' && <Phone className="w-4 h-4" />}
                                    {msg.actionButton.type === 'contact' && <Mail className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{msg.actionButton.label}</span>
                                  </Button>
                                </div>
                              )}
                              
                              <p className={`text-xs mt-2 font-light ${
                                msg.isFromUser ? 'text-gray-300' : 'text-gray-500'
                              }`}>
                                {msg.timestamp && !isNaN(new Date(msg.timestamp).getTime()) 
                                  ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : 'now'
                                }
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
                            <div className="w-8 h-8 bg-[#2E2E2E] rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                              <MessageSquare className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-md border border-gray-100">
                              <div className="flex space-x-1.5">
                                {[0, 1, 2].map((i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-[#2E2E2E] rounded-full"
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                                    transition={{ 
                                      duration: 1.2,
                                      repeat: Infinity,
                                      delay: i * 0.15,
                                      ease: "easeInOut"
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area - Elegant KJESS Design */}
                      <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-[#FAFAFA] to-white">
                        <div className="flex items-end space-x-2 sm:space-x-3">
                          <div className="flex-1">
                            <Input
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Ask about our designs, services, or projects..."
                              className="border-gray-200 focus:border-[#2E2E2E] focus:ring-[#2E2E2E] focus:ring-1 rounded-xl bg-white/80 backdrop-blur-sm font-light placeholder:text-gray-400 transition-all duration-300 text-sm sm:text-base"
                              disabled={sendMessageMutation.isPending || !conversationId}
                              data-testid="input-chat-message"
                            />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || sendMessageMutation.isPending || !conversationId}
                            className="bg-[#2E2E2E] hover:bg-[#1A1A1A] text-white shadow-lg h-11 px-3 sm:px-5 rounded-xl border border-[#3A3A3A] hover:border-[#4A4A4A] transition-all duration-300 font-light min-w-[44px]"
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
                            className="mt-3 flex flex-wrap gap-1 sm:gap-2"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage("What services do you offer?")}
                              className="text-xs font-light border-gray-200 text-[#2E2E2E] hover:bg-[#2E2E2E] hover:text-white hover:border-[#2E2E2E] transition-all duration-300 rounded-lg px-2 py-1 min-w-[80px]"
                              data-testid="button-quick-services"
                            >
                              Our Services
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage("How much does a consultation cost?")}
                              className="text-xs font-light border-gray-200 text-[#2E2E2E] hover:bg-[#2E2E2E] hover:text-white hover:border-[#2E2E2E] transition-all duration-300 rounded-lg px-2 py-1 min-w-[80px]"
                              data-testid="button-quick-pricing"
                            >
                              Pricing
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessage("How do I book a consultation?")}
                              className="text-xs font-light border-gray-200 text-[#2E2E2E] hover:bg-[#2E2E2E] hover:text-white hover:border-[#2E2E2E] transition-all duration-300 rounded-lg px-2 py-1 min-w-[80px]"
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
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
                    onClick={() => setIsMinimized(false)}
                  >
                    <div className="flex items-center justify-center space-x-2 text-[#2E2E2E]">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-light">Click to expand chat</span>
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