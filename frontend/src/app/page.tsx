"use client";

import { usePlanesProximos } from "@/lib/hooks";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const { data: planes, isLoading } = usePlanesProximos(7);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  const criticos = planes?.filter((p) => p.criticidad === "A") || [];
  const medios = planes?.filter((p) => p.criticidad === "B") || [];
  const bajos = planes?.filter((p) => p.criticidad === "C") || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div variants={item} className="relative z-10 flex flex-col md:flex-row items-center gap-8 py-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Pool de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Lubricación</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl bg-black/40 p-4 rounded-xl border-l-4 border-orange-500 backdrop-blur-sm">
            Gestión inteligente de mantenimiento predictivo. Equipos pendientes para los próximos 7 días.
          </p>
        </div>
        
        {/* Abstract "Orb" Visual */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 opacity-90">
          <div className="absolute inset-0 rounded-full bg-orange-600/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 blur-xl opacity-80 animate-float"></div>
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white blur-md rounded-full opacity-60"></div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/40 transition-all duration-500" />
          <div className="relative z-10 p-4">
            <div className="text-6xl font-black text-red-500 drop-shadow-lg">
              {criticos.length}
            </div>
            <div className="text-lg font-medium text-zinc-400 mt-2 uppercase tracking-widest border-t border-white/10 pt-2 inline-block">
              Críticos
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/40 transition-all duration-500" />
          <div className="relative z-10 p-4">
            <div className="text-6xl font-black text-amber-500 drop-shadow-lg">
              {medios.length}
            </div>
            <div className="text-lg font-medium text-zinc-400 mt-2 uppercase tracking-widest border-t border-white/10 pt-2 inline-block">
              Medios
            </div>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/40 transition-all duration-500" />
          <div className="relative z-10 p-4">
            <div className="text-6xl font-black text-emerald-500 drop-shadow-lg">
              {bajos.length}
            </div>
            <div className="text-lg font-medium text-zinc-400 mt-2 uppercase tracking-widest border-t border-white/10 pt-2 inline-block">
              Bajos
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Content Area - Pending Tasks */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                Próximas Tareas
            </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {planes?.slice(0, 6).map((plan: any, idx: number) => (
                <GlassCard 
                    key={idx} 
                    className="flex items-center justify-between group hover:bg-zinc-800/80 cursor-pointer border-l-4 border-l-transparent hover:border-l-orange-500"
                >
                    <div>
                        <h4 className="font-bold text-zinc-100 text-lg group-hover:text-orange-400 transition-colors">
                            {plan.equipo_nombre}
                        </h4>
                        <div className="text-sm text-zinc-500 mt-1">
                            {plan.tarea}  {new Date(plan.fecha_programada).toLocaleDateString()}
                        </div>
                    </div>
                    <div className={
                        px-3 py-1 rounded-full text-xs font-bold border
                        
                    }>
                        {plan.criticidad}
                    </div>
                </GlassCard>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}