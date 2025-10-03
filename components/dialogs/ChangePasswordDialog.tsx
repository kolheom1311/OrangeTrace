"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FloatingToast from "@/components/ui/FloatingToast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { updatePasswordWithReauth } from "@/lib/firebaseActions";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}


export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleChangePassword = async () => {
    if (!user?.email) return;

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setIsUpdating(true);
      setError("");
      setSuccess("");
      await updatePasswordWithReauth(user.email, currentPassword, newPassword);
      setShowToast(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowToast(false);
        onClose();
    }, 2000);
    } catch (err: any) {
        if (err.message == "Firebase: Error (auth/invalid-credential).") {
            setError("Your Current Password is invalid");
        }
        else{
            setError(err.message || "Failed to update password.");
        }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 relative">
            <div className="relative">
                <Input
                type={showPassword ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isUpdating}
                />
                <button
                type="button"
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground transition"
                onClick={toggleShowPassword}
                >
                <AnimatePresence mode="wait">
                    {showPassword ? (
                    <motion.span
                        key="eye-off"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                    >
                        <EyeOff className="w-5 h-5" />
                    </motion.span>
                    ) : (
                    <motion.span
                        key="eye"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                    >
                        <Eye className="w-5 h-5" />
                    </motion.span>
                    )}
                </AnimatePresence>
                </button>
            </div>

            <Input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isUpdating}
            />

            <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdating}
            />
            </div>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {success && <p className="text-sm text-green-600 mt-2">{success}</p>}

            <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                Cancel
            </Button>
            <Button
                onClick={handleChangePassword}
                disabled={
                isUpdating ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
                }
            >
                {isUpdating ? "Updating..." : "Update"}
            </Button>
            </DialogFooter>
        <FloatingToast message="Password updated successfully." show={showToast} />
      </DialogContent>
    </Dialog>
  );
}
