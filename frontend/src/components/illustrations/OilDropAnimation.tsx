"use client";

import { motion } from "framer-motion";

export function OilDropAnimation({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M50 20 Q45 40, 50 60 T50 90 Q55 75, 50 60 Q55 40, 50 20 Z"
        fill="url(#oilGradient)"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
      <defs>
        <linearGradient id="oilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#004c99" stopOpacity="1" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
