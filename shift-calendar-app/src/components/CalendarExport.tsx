import { useStore } from '../stores/useStore';
import {
  getMonthDays,
  formatDate,
  isCurrentMonth,
  isSunday,
  isSaturday,
  MONTH_NAMES,
  WEEKDAY_NAMES,
} from '../utils/dateUtils';
import { getContrastColor } from '../utils/colors';

interface CalendarExportProps {
  year: number;
  month?: number;
  isAnnual?: boolean;
}

export function CalendarExport({ year, month, isAnnual }: CalendarExportProps) {
  const { dayData, shifts, freeDayTypes, customHolidays } = useStore();

  const renderMonth = (monthIndex: number, compact = false) => {
    const monthDate = new Date(year, monthIndex, 1);
    const days = getMonthDays(monthDate);

    return (
      <div
        className={`bg-white ${compact ? 'p-2' : 'p-4'}`}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Month header */}
        <h2
          className={`text-center font-bold capitalize ${
            compact ? 'text-sm mb-2' : 'text-xl mb-4'
          }`}
        >
          {MONTH_NAMES[monthIndex]} {year}
        </h2>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAY_NAMES.map((day, i) => (
            <div
              key={day}
              className={`text-center font-medium ${
                compact ? 'text-[8px] py-0.5' : 'text-xs py-1'
              } ${i >= 5 ? 'text-red-500' : 'text-gray-600'}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dateStr = formatDate(date);
            const data = dayData[dateStr];
            const shift = data?.shiftId
              ? shifts.find((s) => s.id === data.shiftId)
              : null;
            const freeDay = data?.freeDay
              ? freeDayTypes.find((t) => t.id === data.freeDay?.typeId)
              : null;

            const isInMonth = isCurrentMonth(date, monthDate);
            const isHoliday =
              isSunday(date) || customHolidays.some((h) => h.date === dateStr);
            const isSat = isSaturday(date);

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
                key={index}
                className={`border border-gray-100 flex flex-col items-center justify-center ${
                  compact ? 'h-8' : 'h-14'
                } ${!isInMonth ? 'opacity-30' : ''}`}
              >
                <span
                  className={`${compact ? 'text-[8px]' : 'text-xs'} ${
                    !shift && !freeDay && isHoliday
                      ? 'text-red-500'
                      : !shift && !freeDay && isSat
                      ? 'text-red-400'
                      : 'text-gray-700'
                  }`}
                >
                  {date.getDate()}
                </span>
                {(shift || freeDay) && (
                  <div
                    className={`rounded ${
                      compact
                        ? 'text-[6px] px-0.5 py-0 mt-0.5'
                        : 'text-[10px] px-1 py-0.5 mt-1'
                    } font-bold`}
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {displayText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isAnnual) {
    return (
      <div
        className="bg-white p-6"
        style={{
          width: '1200px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Calendario de Turnos {year}
        </h1>

        {/* Annual grid - 4 columns x 3 rows */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              {renderMonth(i, true)}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {shifts.map((shift) => (
            <div key={shift.id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: shift.color }}
              />
              <span className="text-xs text-gray-600">
                {shift.shortName} - {shift.name}
              </span>
            </div>
          ))}
          {freeDayTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-xs text-gray-600">
                {type.shortName} - {type.name}
              </span>
            </div>
          ))}
        </div>

        {/* Watermark */}
        <p className="text-center text-[8px] text-gray-300 mt-4 opacity-50">
          designed by 1076
        </p>
      </div>
    );
  }

  // Monthly export
  return (
    <div
      style={{
        width: '400px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {renderMonth(month!)}

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {shifts.map((shift) => (
            <div key={shift.id} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: shift.color }}
              />
              <span className="text-[10px] text-gray-600">{shift.shortName}</span>
            </div>
          ))}
          {freeDayTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-[10px] text-gray-600">{type.shortName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <p className="text-center text-[6px] text-gray-300 pb-2 opacity-50">
        designed by 1076
      </p>
    </div>
  );
}
