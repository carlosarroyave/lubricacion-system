"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  width?: string;
}

interface GlassTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function GlassTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  isLoading,
}: GlassTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full rounded-xl bg-zinc-900/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex w-full items-center border-b border-white/10 bg-zinc-950/40 px-6 py-4">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={`text-xs font-semibold uppercase tracking-wider text-zinc-500 ${
              col.width ? col.width : "flex-1"
            }`}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {data.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onRowClick && onRowClick(item)}
            className={`
              group relative flex w-full items-center px-6 py-4 border-b border-white/5
              hover:bg-orange-500/5 transition-all duration-300 cursor-pointer
              last:border-none
            `}
          >
            {/* Hover Glow Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_orange]" />

            {columns.map((col, cIdx) => (
              <div
                key={cIdx}
                className={`text-sm text-zinc-300 group-hover:text-white transition-colors ${
                  col.width ? col.width : "flex-1"
                }`}
              >
                {col.cell
                  ? col.cell(item)
                  : (item[col.accessorKey as keyof T] as ReactNode)}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    
      {data.length === 0 && (
         <div className="p-8 text-center text-zinc-500 italic">
            No se encontraron registros.
         </div>
      )}
    </div>
  );
}
