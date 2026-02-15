"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GearAnimation } from "@/components/illustrations/GearAnimation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useHealth } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Pool de Lubricación", href: "/", icon: "📊" },
  { name: "Nuevo Equipo", href: "/equipos/nuevo", icon: "➕" },
  { name: "Inventario", href: "/equipos", icon: "📦" },
  { name: "Historial", href: "/historial", icon: "📈" },
  { name: "Herramientas", href: "/herramientas", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: health } = useHealth();
  const connected = health?.status === "healthy";

  return (
    <aside className="w-64 glass-card m-4 rounded-glass flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <GearAnimation className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="font-bold text-lg">Lubricación</h1>
            <p className="text-xs text-gray-600">Sistema Industrial</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "hover:bg-white/20",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-blue-700 font-medium"
                  : "text-gray-700"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <StatusBadge connected={connected} />
        <p className="text-xs text-gray-500">v1.0.0</p>
      </div>
    </aside>
  );
}
