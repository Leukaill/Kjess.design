import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, ArrowLeft, Shield, Sparkles, Users, AlertCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import logoUrl from "@assets/WhatsApp_Image_2025-08-13_at_7.56.31_PM-removebg-preview_1755850108303.png";

const AdminLogin = () => {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const queryClient = useQueryClient();

  // Check if admin exists
  const { data: adminExistsData, isLoading: checkingAdmin } = useQuery({
    queryKey: ['/api/admin/exists'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/exists', {});
      return await response.json();
    },
  });

  // Update setup mode when admin existence data changes
  useEffect(() => {
    if (adminExistsData) {
      setIsSetupMode(!(adminExistsData as any)?.exists);
    }
  }, [adminExistsData]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { password: string }) => {
      const response = await apiRequest('POST', '/api/admin/login', credentials);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check'] });
      setLocation('/admin/dashboard');
    },
    onError: (error: any) => {
      setError(error.message || 'Login failed. Please check your password.');
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/admin/setup', credentials);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check'] });
      setLocation('/admin/dashboard');
    },
    onError: (error: any) => {
      setError(error.message || 'Setup failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (isSetupMode && !username.trim()) {
      setError('Username is required');
      return;
    }
    setError('');

    if (isSetupMode) {
      setupMutation.mutate({ username, password });
    } else {
      loginMutation.mutate({ password });
    }
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleBackToHome}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors duration-200"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </motion.button>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {isSetupMode ? 'Setup Admin Account' : 'Admin Panel'}
            </CardTitle>
            <CardDescription className="text-white/70">
              {isSetupMode 
                ? 'Create your admin account to get started'
                : 'Enter your password to access the admin dashboard'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {checkingAdmin ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSetupMode && (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white/90">
                      Username
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                        placeholder="Admin username"
                        disabled={setupMutation.isPending || loginMutation.isPending}
                        data-testid="input-admin-username"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    {isSetupMode ? 'Create Password' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                      placeholder={isSetupMode ? "Create a secure password" : "Enter admin password"}
                      disabled={setupMutation.isPending || loginMutation.isPending}
                      data-testid="input-admin-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isSetupMode && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-100 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Only one admin account is allowed in the system.
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert className="bg-red-500/20 border-red-500/30 text-red-100">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={setupMutation.isPending || loginMutation.isPending}
                  data-testid="button-admin-submit"
                >
                  {(setupMutation.isPending || loginMutation.isPending) ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    isSetupMode ? 'Create Admin Account' : 'Access Admin Panel'
                  )}
                </Button>
              </form>
            )}

            {/* Company logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center pt-4 border-t border-white/20"
            >
              <img 
                src={logoUrl} 
                alt="KJESS Designs"
                className="w-8 h-8 opacity-50"
              />
            </motion.div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/50 text-sm mt-4"
        >
          Access granted only to authorized administrators
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;