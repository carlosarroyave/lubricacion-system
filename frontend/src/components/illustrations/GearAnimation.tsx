"use client";

import { motion } from "framer-motion";

export function GearAnimation({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <motion.path
        d="M50 20 L55 35 L70 35 L57 45 L62 60 L50 50 L38 60 L43 45 L30 35 L45 35 Z"
        fill="currentColor"
        opacity="0.7"
      />
      <motion.circle
        cx="50"
        cy="50"
        r="15"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <motion.rect
          key={angle}
          x="48"
          y="10"
          width="4"
          height="15"
          fill="currentColor"
          style={{
            transformOrigin: "50px 50px",
            transform: `rotate(${angle}deg)`,
          }}
        />
      ))}
    </motion.svg>
  );
}
