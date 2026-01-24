// Tipo de turno
export interface Shift {
  id: string;
  name: string;
  shortName: string;
  color: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

// Tipo de día libre
export interface FreeDayType {
  id: string;
  name: string;
  shortName: string;
  color: string;
  countMode: 'days' | 'hours';
  defaultHours: number;
}

// Día libre asignado
export interface FreeDay {
  typeId: string;
  hours?: number; // Solo si countMode es 'hours'
}

// Festivo manual
export interface CustomHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

// Cambio de turno
export interface ShiftSwap {
  id: string;
  dateWorkedForCoworker: string;  // YYYY-MM-DD
  shiftWorked: string;            // ID del turno
  dateCoworkerWorksForUser: string; // YYYY-MM-DD
  coworkerId: number;
  createdAt: string;
}

// Datos de un día específico
export interface DayData {
  date: string;           // YYYY-MM-DD
  shiftId?: string;       // ID del turno asignado
  freeDay?: FreeDay;      // Día libre asignado
  horasExtra: number;
  horasExtraordinarias: number;
  compensacionHoraria: number;
  horasExclusividad: number;
  bolsaHoras: number;
  isCustomHoliday?: boolean;
  customHolidayName?: string;
  notes?: string;
}

// Configuración de la app
export interface AppConfig {
  defaultShiftId?: string;
}

// Estadísticas calculadas
export interface Statistics {
  workedDays: number;
  workedHours: number;
  nightHours: number;
  horasExtra: number;
  horasExtraordinarias: number;
  compensacionHoraria: number;
  horasExclusividad: number;
  bolsaHoras: number;
  holidaysWorkedDays: number;
  holidaysWorkedHours: number;
  shiftCounts: Record<string, number>;
  freeDayCounts: Record<string, { days: number; hours: number }>;
}

// Mes para exportar
export interface MonthExport {
  year: number;
  month: number; // 0-11
}
