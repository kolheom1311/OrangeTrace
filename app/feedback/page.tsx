"use client";

import { AuthGuard } from '@/components/auth/AuthGuard';

function FeedbackContent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Feedback & Reviews</h1>
        <p className="text-muted-foreground">
          Will be implemented soon...
        </p>
      </div>
    </div>
  );
}


export default function FeedbackPage() {
  return (
    <AuthGuard>
      <FeedbackContent />
    </AuthGuard>
  );
}