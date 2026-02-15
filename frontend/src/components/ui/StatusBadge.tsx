"use client";

export function StatusBadge({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            connected ? "bg-green-500" : "bg-red-500"
          )}
        />
        {connected && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
        )}
      </div>
      <span className="text-sm font-medium">
        {connected ? "Conectado" : "Desconectado"}
      </span>
    </div>
  );
}

import { cn } from "@/lib/utils";
