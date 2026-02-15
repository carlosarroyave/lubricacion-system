import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Criticidad } from "./types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const criticidadColors = {
  A: {
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#EF4444",
    label: "Crítica",
  },
  B: {
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#F59E0B",
    label: "Media",
  },
  C: {
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#10B981",
    label: "Baja",
  },
};

export const statusColors = {
  "🔴 VENCIDO": {
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#EF4444",
  },
  "🟡 HOY/MAÑANA": {
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#F59E0B",
  },
  "🟢 PRÓXIMOS": {
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#10B981",
  },
};

export function getCriticidadColor(criticidad: Criticidad) {
  return criticidadColors[criticidad];
}

export function formatDate(date: string | Date, formatStr: string = "PP") {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, formatStr, { locale: es });
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "PPp");
}

export function generateCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? "" : String(value);
        // Escape commas and quotes
        return stringValue.includes(",") || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
