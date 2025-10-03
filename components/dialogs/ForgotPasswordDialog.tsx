"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleGenerateLink = async () => {
    setIsSending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/generate-password-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to send reset email.");
      }

      setSuccess("Password reset link has been sent to your email.");

      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };


  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      setEmail("");
      setSuccess("");
      setError("");
      setIsSending(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-2">
          Enter your registered email address. A link will be sent via email to reset the password.
        </p>

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSending}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerateLink}
            disabled={isSending || !email || !!success}
          >
            {isSending ? "Resetting..." : "Reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
