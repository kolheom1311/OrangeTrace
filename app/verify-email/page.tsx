'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [timer, setTimer] = useState(5); 

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`/api/auth/enable-account?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('User enabling failed');
        return res.json();
      })
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        console.error('Enable User Error:', err);
        setStatus('error');
      });
  }, [searchParams]);

  useEffect(() => {
    if (status === 'success') {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, router]);

  return (
    
    <div className="flex justify-center items-center h-screen bg-background">
      <Card className="w-[400px] text-center p-4">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'verifying' && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <p>Verifying your account...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold text-green-600">✅ Your account has been activated!</h1>
              <p className="mt-4">You can now log in to OrangeTrace.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Redirecting to login page in {timer} second{timer !== 1 ? 's' : ''}...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold text-red-600">❌ Link expired or invalid</h1>
              <p className="mt-4">Please request a new activation email.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    
  );
}
