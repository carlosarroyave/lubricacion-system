"use client";

import { useEquipos, useDeleteEquipo } from "@/lib/hooks";
import { GlassTable } from "@/components/ui/GlassTable";
import { Button } from "@/components/ui/Button";
import { generateCSV, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function InventarioPage() {
  const { data: equipos, isLoading } = useEquipos();
  const { mutate: deleteEquipo } = useDeleteEquipo();

  const handleExport = () => {
    if (equipos) {
      generateCSV(
        equipos.map((e) => ({
          ID: e.id,
          Nombre: e.nombre,
          Componente: e.componente || "",
          Criticidad: e.criticidad,
          Ubicacion: e.ubicacion || "",
          Estado: e.estado,
          Creado: formatDate(e.created_at),
        })),
        "equipos_" + new Date().toISOString().split("T")[0] + ".csv"
      );
    }
  };

  const columns = [
    {
      header: "Equipo",
      accessorKey: "nombre" as const,
      width: "flex-[2]",
      cell: (item: any) => (
        <div>
          <div className="font-bold text-white transition-colors group-hover:text-orange-400">
            {item.nombre}
          </div>
          <div className="text-xs text-zinc-500">ID: {item.id}</div>
        </div>
      )
    },
    {
      header: "Componente",
      accessorKey: "componente" as const,
      width: "flex-1",
      cell: (item: any) => <span className="text-zinc-400">{item.componente || "-"}</span>
    },
    {
      header: "Criticidad",
      accessorKey: "criticidad" as const,
      width: "w-24 text-center",
      cell: (item: any) => {
        const colors: Record<string, string> = {
          "A": "bg-red-500/20 text-red-400 border-red-500/30",
          "B": "bg-amber-500/20 text-amber-400 border-amber-500/30",
          "C": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        };
        return (
          <span className={px-2 py-1 rounded-md text-xs font-bold border }>
            {item.criticidad}
          </span>
        );
      }
    },
    {
      header: "Ubicación",
      accessorKey: "ubicacion" as const,
      width: "flex-1",
    },
    {
      header: "Estado",
      accessorKey: "estado" as const,
      width: "w-32",
      cell: (item: any) => (
        <span className="flex items-center gap-2">
          <span className={w-2 h-2 rounded-full } />
          {item.estado}
        </span>
      )
    },
    {
      header: "Acciones",
      width: "w-32 text-right",
      cell: (item: any) => (
        <Button
          variant="danger"
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs px-3 py-1 h-auto"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (confirm("¿Eliminar este equipo?")) {
              deleteEquipo(item.id);
            }
          }}
        >
          Eliminar
        </Button>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Inventario <span className="text-zinc-600">/</span> Equipos
          </h1>
          <p className="text-zinc-400 mt-2 max-w-lg">
            Gestión centralizada de activos y maquinaria.
          </p>
        </div>
        
        <Button 
          onClick={handleExport}
          className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 shadow-lg hover:shadow-orange-500/10 transition-all font-semibold"
        >
          <span className="mr-2"></span> Exportar CSV
        </Button>
      </div>

      <GlassTable 
        data={equipos || []}
        columns={columns}
        isLoading={isLoading}
      />
    </motion.div>
  );
}
