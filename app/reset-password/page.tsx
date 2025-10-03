"use client";
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(!!oobCode);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (oobCode) {
      const verifyCode = async () => {
        try {
          const email = await verifyPasswordResetCode(auth, oobCode);
          setVerifiedEmail(email);
          setError(""); 
        } catch (err: any) {
          setError("This password reset link is invalid or has expired. Please request a new one.");
        } finally {
          setIsVerifying(false);
        }
      };
      verifyCode();
    } else {
      router.push('/not-found');
    }
  }, [oobCode, router]);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleReset = async () => {
    if (!oobCode) {
      setError("An unexpected error occurred. No reset code found.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
        setError("Password should be at least 6 characters long.");
        return;
    }

    setIsUpdating(true);
    setError("");
    setStatus("");

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("✅ Your password has been reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!oobCode) {
    return null;
  }

  if (isVerifying) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <p className="text-lg">Verifying reset link...</p>
        </div>
    );
  }

  if (error && !verifiedEmail) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <div className="w-full max-w-md p-6 bg-card border rounded-xl shadow-lg">
                <h1 className="text-xl font-semibold text-destructive mb-4">Link Invalid</h1>
                <p className="text-destructive">{error}</p>
                <Button onClick={() => router.push('/login')} className="mt-6 w-full">
                    Return to Login
                </Button>
            </div>
        </div>
    );
  }

  return (
    
    <main className="flex min-h-[58vh] items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-lg text-card-foreground">
        <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground">
                Enter a new password for <strong>{verifiedEmail}</strong>
            </p>
        </div>

        <div className="space-y-4">
            <div className="relative">
                <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isUpdating}
                    className="pr-10"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    onClick={toggleShowPassword}
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
            <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdating}
            />
        </div>

        <div className="h-5 text-center">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {status && <p className="text-sm text-green-600">{status}</p>}
        </div>

        <Button
            onClick={handleReset}
            disabled={isUpdating || !newPassword || !confirmPassword || !!status}
            className="w-full"
        >
            {isUpdating ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </main>
    
  );
}
