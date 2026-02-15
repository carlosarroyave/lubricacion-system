"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/" },
  { name: "Inventario", href: "/equipos" },
  { name: "Historial", href: "/historial" },
  { name: "Herramientas", href: "/herramientas" },
];

export function Navbar() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative flex items-center gap-1 rounded-full bg-zinc-900/60 p-2 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
              onMouseEnter={() => setHoveredPath(item.href)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              {item.name}
              
              {/* Active Background (Orange Glow) */}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 opacity-80 -z-10 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}

              {/* Hover Background (Subtle) */}
              {hoveredPath === item.href && !isActive && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 rounded-full bg-white/5 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
