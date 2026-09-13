import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  getDay,
  parse,
  differenceInMinutes
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { Shift } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const parseDate = (dateStr: string): Date => {
  return parse(dateStr, 'yyyy-MM-dd', new Date());
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: es });
};

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });

  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
};

export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isSunday = (date: Date): boolean => {
  return getDay(date) === 0;
};

export const isSaturday = (date: Date): boolean => {
  return getDay(date) === 6;
};

// Calcula si un día es festivo (domingo completo o sábado desde 14:30)
export const isHoliday = (date: Date, customHolidays: string[]): boolean => {
  if (isSunday(date)) return true;
  if (customHolidays.includes(formatDate(date))) return true;
  return false;
};

// Calcula las horas festivas trabajadas en un turno
export const calculateHolidayHours = (
  date: Date,
  shift: Shift,
  customHolidays: string[]
): number => {
  const dateStr = formatDate(date);
  const isCustomHoliday = customHolidays.includes(dateStr);

  // Domingo o festivo manual: todas las horas son festivas
  if (isSunday(date) || isCustomHoliday) {
    return calculateShiftHours(shift);
  }

  // Sábado: solo cuentan las horas desde 14:30
  if (isSaturday(date)) {
    const saturdayHolidayStart = parse('14:30', 'HH:mm', date);
    const shiftStart = parse(shift.startTime, 'HH:mm', date);
    let shiftEnd = parse(shift.endTime, 'HH:mm', date);

    // Si el turno cruza medianoche
    if (shiftEnd <= shiftStart) {
      shiftEnd = addDays(shiftEnd, 1);
    }

    // Calcular overlap con periodo festivo (14:30 hasta fin de día/turno)
    if (shiftEnd <= saturdayHolidayStart) {
      return 0; // Turno termina antes de las 14:30
    }

    const effectiveStart = shiftStart > saturdayHolidayStart ? shiftStart : saturdayHolidayStart;
    const overlapMinutes = differenceInMinutes(shiftEnd, effectiveStart);

    return Math.max(0, overlapMinutes / 60);
  }

  return 0;
};

// Calcula las horas nocturnas (00:00-08:00) de un turno
export const calculateNightHours = (shift: Shift): number => {
  const baseDate = new Date(2000, 0, 1); // Fecha base arbitraria
  const nightStart = parse('00:00', 'HH:mm', baseDate);
  const nightEnd = parse('08:00', 'HH:mm', baseDate);

  let shiftStart = parse(shift.startTime, 'HH:mm', baseDate);
  let shiftEnd = parse(shift.endTime, 'HH:mm', baseDate);

  // Si el turno cruza medianoche
  const crossesMidnight = shiftEnd <= shiftStart;

  if (crossesMidnight) {
    // Parte después de medianoche (00:00 hasta fin del turno)
    const morningPart = Math.min(
      differenceInMinutes(shiftEnd, nightStart),
      differenceInMinutes(nightEnd, nightStart)
    );

    // Parte antes de medianoche que entra en el periodo nocturno del día siguiente
    // No aplica para horas nocturnas del mismo día

    return Math.max(0, morningPart) / 60;
  } else {
    // Turno normal dentro del mismo día
    if (shiftEnd <= nightStart || shiftStart >= nightEnd) {
      return 0;
    }

    const effectiveStart = shiftStart > nightStart ? shiftStart : nightStart;
    const effectiveEnd = shiftEnd < nightEnd ? shiftEnd : nightEnd;

    return Math.max(0, differenceInMinutes(effectiveEnd, effectiveStart)) / 60;
  }
};

// Calcula las horas totales de un turno
export const calculateShiftHours = (shift: Shift): number => {
  const baseDate = new Date(2000, 0, 1);
  let shiftStart = parse(shift.startTime, 'HH:mm', baseDate);
  let shiftEnd = parse(shift.endTime, 'HH:mm', baseDate);

  // Si el turno cruza medianoche
  if (shiftEnd <= shiftStart) {
    shiftEnd = addDays(shiftEnd, 1);
  }

  return differenceInMinutes(shiftEnd, shiftStart) / 60;
};

export const WEEKDAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
