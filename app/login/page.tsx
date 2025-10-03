"use client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "sonner";
import ForgotPasswordDialog from "@/components/dialogs/ForgotPasswordDialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const [forgotPasswordDialogOpen, setforgotPasswordDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const showLoading = isSubmitting;

  return (
    <motion.div 
      className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4"
            >
              <LogIn className="h-6 w-6 text-white" />
            </motion.div>
            <CardTitle className="text-2xl">{t('auth.login')}</CardTitle>
            <CardDescription>
              Enter your credentials to access your OrangeTrace account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  required
                  disabled={showLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={showLoading}
                  />
                  <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={toggleShowPassword}
                      disabled={showLoading}
                  >
                      <AnimatePresence mode="wait">
                          {showPassword ? (
                              <motion.span key="eye-off" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                                  <EyeOff className="w-5 h-5" />
                              </motion.span>
                          ) : (
                              <motion.span key="eye" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                                  <Eye className="w-5 h-5" />
                              </motion.span>
                          )}
                      </AnimatePresence>
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <Link href="#" onClick={() => setforgotPasswordDialogOpen(true)} className="text-sm text-orange-600">
                    Forgot Password?
                  </Link>
                  <ForgotPasswordDialog
                    open={forgotPasswordDialogOpen}
                    onClose={() => setforgotPasswordDialogOpen(false)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={showLoading}
              >
                {showLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  t('auth.login')
                )}
              </Button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-orange-600 hover:underline">
                  {t('auth.register')}
                </Link>
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-muted rounded-lg"
            >
              <p className="text-sm font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs space-y-1">
                <p><strong>Farmer:</strong> farmer@demo.com / password</p>
                <p><strong>Buyer:</strong> buyer@demo.com / password</p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}