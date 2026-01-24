import { useStore } from '../stores/useStore';
import { formatDate, isToday, isSunday, isSaturday } from '../utils/dateUtils';
import { getContrastColor } from '../utils/colors';
import { cn } from '../utils/cn';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isSelectionMode: boolean;
  onClick: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function DayCell({
  date,
  isCurrentMonth,
  isSelected,
  isSelectionMode,
  onClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: DayCellProps) {
  const { dayData, shifts, freeDayTypes, customHolidays } = useStore();

  const dateStr = formatDate(date);
  const data = dayData[dateStr];
  const shift = data?.shiftId ? shifts.find((s) => s.id === data.shiftId) : null;
  const freeDay = data?.freeDay
    ? freeDayTypes.find((t) => t.id === data.freeDay?.typeId)
    : null;

  const isHoliday =
    isSunday(date) || customHolidays.some((h) => h.date === dateStr);
  const isSat = isSaturday(date);

  const dayNumber = date.getDate();

  // Determinar color de fondo
  let bgColor = 'transparent';
  let textColor = 'inherit';
  let displayText = '';

  if (shift) {
    bgColor = shift.color;
    textColor = getContrastColor(shift.color);
    displayText = shift.shortName;
  } else if (freeDay) {
    bgColor = freeDay.color;
    textColor = getContrastColor(freeDay.color);
    displayText = freeDay.shortName;
  }

  return (
    <div
      className={cn(
        'day-cell relative flex flex-col items-center justify-center p-1 border-b border-r border-gray-100 min-h-[52px] no-select transition-all',
        !isCurrentMonth && 'opacity-30',
        isSelected && 'ring-2 ring-inset ring-primary-500 bg-primary-50',
        isSelectionMode && !isSelected && 'active:bg-gray-100'
      )}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Número del día */}
      <span
        className={cn(
          'text-sm font-medium leading-none mb-1',
          isToday(date) &&
            'w-6 h-6 flex items-center justify-center rounded-full border-2 border-black',
          !shift && !freeDay && isHoliday && 'text-red-500',
          !shift && !freeDay && isSat && !isHoliday && 'text-red-400'
        )}
      >
        {dayNumber}
      </span>

      {/* Indicador de turno/día libre */}
      {(shift || freeDay) && (
        <div
          className="w-full flex-1 flex items-center justify-center rounded text-[10px] font-bold max-h-5"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {displayText}
        </div>
      )}

      {/* Indicador de festivo trabajado */}
      {shift && isHoliday && (
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
      )}

      {/* Indicador de horas extra */}
      {data && (data.horasExtra > 0 || data.horasExtraordinarias > 0) && (
        <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
      )}
    </div>
  );
}
