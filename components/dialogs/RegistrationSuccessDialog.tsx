"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface RegistrationSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function RegistrationSuccessDialog({ open, onClose }: RegistrationSuccessDialogProps) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registration Successful 🎉</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-2">
          You're almost there! 🚀 Verify your email to complete registration 📧✅ 
        </p>
        <DialogFooter>
          <Button
            onClick={() => {router.push('/login');
            }}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
