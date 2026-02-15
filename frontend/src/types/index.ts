export interface LubricationPoint {
  id: string;
  equipment: string;
  lubricantType: string;
  frequency: string;
  lastDate: string;
  nextDate: string;
  status: 'active' | 'expired' | 'upcoming' | 'scheduled';
}

export interface InventoryItem {
  code: string;
  name: string;
  subName: string;
  type: string;
  currentStock: number;
  unit: string;
  minStock: number;
  location: string;
  status: 'available' | 'critical' | 'low';
  percentage: number;
}

export interface Equipment {
  id: string;
  name: string;
  area: string;
  type: string;
  status: 'operational' | 'maintenance' | 'offline';
  icon: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  technician: string;
  status: 'completed' | 'in-progress' | 'registered';
  type: 'routine' | 'change' | 'inspection';
}

export type TabType = 'pool' | 'equipos' | 'inventario' | 'historial' | 'dashboard';
