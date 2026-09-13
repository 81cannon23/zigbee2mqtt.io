import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Shift, FreeDayType, DayData, ShiftSwap, CustomHoliday, Statistics } from '../types';
import { formatDate, calculateShiftHours, calculateNightHours, calculateHolidayHours, isSunday, isSaturday } from '../utils/dateUtils';

interface AppState {
  // Turnos
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;

  // Tipos de días libres
  freeDayTypes: FreeDayType[];
  addFreeDayType: (type: FreeDayType) => void;
  updateFreeDayType: (id: string, type: Partial<FreeDayType>) => void;
  deleteFreeDayType: (id: string) => void;

  // Datos de días
  dayData: Record<string, DayData>;
  setDayData: (date: string, data: Partial<DayData>) => void;
  clearDayData: (date: string) => void;
  setMultipleDaysShift: (dates: string[], shiftId: string) => void;

  // Festivos personalizados
  customHolidays: CustomHoliday[];
  addCustomHoliday: (holiday: CustomHoliday) => void;
  removeCustomHoliday: (date: string) => void;

  // Cambios de turno
  shiftSwaps: ShiftSwap[];
  addShiftSwap: (swap: ShiftSwap) => void;
  removeShiftSwap: (id: string) => void;

  // Utilidades
  getShiftById: (id: string) => Shift | undefined;
  getFreeDayTypeById: (id: string) => FreeDayType | undefined;
  getDayData: (date: string) => DayData | undefined;
  calculateStatistics: (year: number) => Statistics;
}

// Turnos por defecto
const defaultShifts: Shift[] = [
  {
    id: 'shift-1',
    name: 'Mañana',
    shortName: 'M',
    color: '#3B82F6',
    startTime: '06:00',
    endTime: '14:00',
  },
  {
    id: 'shift-2',
    name: 'Tarde',
    shortName: 'T',
    color: '#10B981',
    startTime: '14:00',
    endTime: '22:00',
  },
  {
    id: 'shift-3',
    name: 'Noche',
    shortName: 'N',
    color: '#8B5CF6',
    startTime: '22:00',
    endTime: '06:00',
  },
];

// Tipos de días libres por defecto
const defaultFreeDayTypes: FreeDayType[] = [
  {
    id: 'free-1',
    name: 'Descanso',
    shortName: 'D',
    color: '#22C55E',
    countMode: 'days',
    defaultHours: 8,
  },
  {
    id: 'free-2',
    name: 'Vacaciones',
    shortName: 'V',
    color: '#F59E0B',
    countMode: 'days',
    defaultHours: 8,
  },
  {
    id: 'free-3',
    name: 'Asuntos propios',
    shortName: 'AP',
    color: '#EC4899',
    countMode: 'hours',
    defaultHours: 8,
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      shifts: defaultShifts,
      freeDayTypes: defaultFreeDayTypes,
      dayData: {},
      customHolidays: [],
      shiftSwaps: [],

      // Acciones para turnos
      addShift: (shift) =>
        set((state) => ({
          shifts: [...state.shifts, shift],
        })),

      updateShift: (id, updates) =>
        set((state) => ({
          shifts: state.shifts.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteShift: (id) =>
        set((state) => ({
          shifts: state.shifts.filter((s) => s.id !== id),
        })),

      // Acciones para tipos de días libres
      addFreeDayType: (type) =>
        set((state) => ({
          freeDayTypes: [...state.freeDayTypes, type],
        })),

      updateFreeDayType: (id, updates) =>
        set((state) => ({
          freeDayTypes: state.freeDayTypes.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteFreeDayType: (id) =>
        set((state) => ({
          freeDayTypes: state.freeDayTypes.filter((t) => t.id !== id),
        })),

      // Acciones para datos de días
      setDayData: (date, data) =>
        set((state) => {
          const existing = state.dayData[date];
          return {
            dayData: {
              ...state.dayData,
              [date]: {
                date,
                horasExtra: existing?.horasExtra ?? 0,
                horasExtraordinarias: existing?.horasExtraordinarias ?? 0,
                compensacionHoraria: existing?.compensacionHoraria ?? 0,
                horasExclusividad: existing?.horasExclusividad ?? 0,
                bolsaHoras: existing?.bolsaHoras ?? 0,
                shiftId: existing?.shiftId,
                freeDay: existing?.freeDay,
                notes: existing?.notes,
                ...data,
              },
            },
          };
        }),

      clearDayData: (date) =>
        set((state) => {
          const newDayData = { ...state.dayData };
          delete newDayData[date];
          return { dayData: newDayData };
        }),

      setMultipleDaysShift: (dates, shiftId) =>
        set((state) => {
          const newDayData = { ...state.dayData };
          dates.forEach((date) => {
            const existing = newDayData[date];
            newDayData[date] = {
              date,
              horasExtra: existing?.horasExtra ?? 0,
              horasExtraordinarias: existing?.horasExtraordinarias ?? 0,
              compensacionHoraria: existing?.compensacionHoraria ?? 0,
              horasExclusividad: existing?.horasExclusividad ?? 0,
              bolsaHoras: existing?.bolsaHoras ?? 0,
              notes: existing?.notes,
              shiftId,
              freeDay: undefined,
            };
          });
          return { dayData: newDayData };
        }),

      // Acciones para festivos
      addCustomHoliday: (holiday) =>
        set((state) => ({
          customHolidays: [...state.customHolidays.filter(h => h.date !== holiday.date), holiday],
        })),

      removeCustomHoliday: (date) =>
        set((state) => ({
          customHolidays: state.customHolidays.filter((h) => h.date !== date),
        })),

      // Acciones para cambios de turno
      addShiftSwap: (swap) =>
        set((state) => {
          const newDayData = { ...state.dayData };

          // Día que trabaja el usuario para el compañero: agregar turno
          const existingWorked = newDayData[swap.dateWorkedForCoworker];
          newDayData[swap.dateWorkedForCoworker] = {
            date: swap.dateWorkedForCoworker,
            horasExtra: existingWorked?.horasExtra ?? 0,
            horasExtraordinarias: existingWorked?.horasExtraordinarias ?? 0,
            compensacionHoraria: existingWorked?.compensacionHoraria ?? 0,
            horasExclusividad: existingWorked?.horasExclusividad ?? 0,
            bolsaHoras: existingWorked?.bolsaHoras ?? 0,
            notes: existingWorked?.notes,
            freeDay: existingWorked?.freeDay,
            shiftId: swap.shiftWorked,
          };

          // Día que el compañero trabaja para el usuario: quitar turno
          if (newDayData[swap.dateCoworkerWorksForUser]) {
            newDayData[swap.dateCoworkerWorksForUser] = {
              ...newDayData[swap.dateCoworkerWorksForUser],
              shiftId: undefined,
            };
          }

          return {
            shiftSwaps: [...state.shiftSwaps, swap],
            dayData: newDayData,
          };
        }),

      removeShiftSwap: (id) =>
        set((state) => ({
          shiftSwaps: state.shiftSwaps.filter((s) => s.id !== id),
        })),

      // Getters
      getShiftById: (id) => get().shifts.find((s) => s.id === id),

      getFreeDayTypeById: (id) => get().freeDayTypes.find((t) => t.id === id),

      getDayData: (date) => get().dayData[date],

      // Calcular estadísticas anuales
      calculateStatistics: (year) => {
        const state = get();
        const stats: Statistics = {
          workedDays: 0,
          workedHours: 0,
          nightHours: 0,
          horasExtra: 0,
          horasExtraordinarias: 0,
          compensacionHoraria: 0,
          horasExclusividad: 0,
          bolsaHoras: 0,
          holidaysWorkedDays: 0,
          holidaysWorkedHours: 0,
          shiftCounts: {},
          freeDayCounts: {},
        };

        const customHolidayDates = state.customHolidays.map(h => h.date);

        // Inicializar contadores de turnos
        state.shifts.forEach((shift) => {
          stats.shiftCounts[shift.id] = 0;
        });

        // Inicializar contadores de días libres
        state.freeDayTypes.forEach((type) => {
          stats.freeDayCounts[type.id] = { days: 0, hours: 0 };
        });

        // Iterar sobre todos los días del año
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        let currentDate = startDate;

        while (currentDate <= endDate) {
          const dateStr = formatDate(currentDate);
          const dayData = state.dayData[dateStr];

          if (dayData) {
            // Sumar horas manuales
            stats.horasExtra += dayData.horasExtra || 0;
            stats.horasExtraordinarias += dayData.horasExtraordinarias || 0;
            stats.compensacionHoraria += dayData.compensacionHoraria || 0;
            stats.horasExclusividad += dayData.horasExclusividad || 0;
            stats.bolsaHoras += dayData.bolsaHoras || 0;

            // Si tiene turno asignado
            if (dayData.shiftId) {
              const shift = state.getShiftById(dayData.shiftId);
              if (shift) {
                stats.workedDays += 1;
                const shiftHours = calculateShiftHours(shift);
                stats.workedHours += shiftHours;
                stats.nightHours += calculateNightHours(shift);
                stats.shiftCounts[shift.id] = (stats.shiftCounts[shift.id] || 0) + 1;

                // Verificar si es festivo
                const isHoliday = isSunday(currentDate) ||
                                  customHolidayDates.includes(dateStr);
                const isSat = isSaturday(currentDate);

                if (isHoliday) {
                  stats.holidaysWorkedDays += 1;
                  stats.holidaysWorkedHours += shiftHours;
                } else if (isSat) {
                  const holidayHours = calculateHolidayHours(currentDate, shift, customHolidayDates);
                  if (holidayHours > 0) {
                    stats.holidaysWorkedHours += holidayHours;
                  }
                }
              }
            }

            // Si tiene día libre asignado
            if (dayData.freeDay) {
              const freeDayType = state.getFreeDayTypeById(dayData.freeDay.typeId);
              if (freeDayType) {
                const count = stats.freeDayCounts[freeDayType.id];
                if (count) {
                  count.days += 1;
                  count.hours += dayData.freeDay.hours || freeDayType.defaultHours;
                }
              }
            }
          }

          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }

        return stats;
      },
    }),
    {
      name: 'shift-calendar-storage',
    }
  )
);
