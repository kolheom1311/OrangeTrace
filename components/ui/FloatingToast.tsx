"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface FloatingToastProps {
  message: string;
  show: boolean;
}

export default function FloatingToast({ message, show }: FloatingToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2"
        >
          <CheckCircle size={18} />
          <span className="text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
