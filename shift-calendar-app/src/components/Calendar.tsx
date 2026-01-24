import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { addMonths, subMonths } from 'date-fns';
import { useStore } from '../stores/useStore';
import { DayCell } from './DayCell';
import { DayEditor } from './DayEditor';
import { ShiftSelector } from './ShiftSelector';
import { getMonthDays, formatMonthYear, formatDate, isCurrentMonth } from '../utils/dateUtils';
import { cn } from '../utils/cn';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [showShiftSelector, setShowShiftSelector] = useState(false);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const { setMultipleDaysShift } = useStore();

  const days = getMonthDays(currentMonth);

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const handleDayTouchStart = useCallback((date: Date, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };

    longPressTimer.current = setTimeout(() => {
      // Activar modo selección con el día exacto presionado
      const dateStr = formatDate(date);
      setIsSelectionMode(true);
      setSelectedDates([dateStr]);
      // Feedback háptico si está disponible
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  }, []);

  const handleDayTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartPos.current && longPressTimer.current) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

      // Si se mueve más de 10px, cancelar long press
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  }, []);

  const handleDayTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    touchStartPos.current = null;
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    const dateStr = formatDate(date);

    if (isSelectionMode) {
      setSelectedDates((prev) =>
        prev.includes(dateStr)
          ? prev.filter((d) => d !== dateStr)
          : [...prev, dateStr]
      );
    } else {
      setEditingDate(dateStr);
    }
  }, [isSelectionMode]);

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedDates([]);
  };

  const confirmSelection = () => {
    if (selectedDates.length > 0) {
      setShowShiftSelector(true);
    }
  };

  const handleShiftSelected = (shiftId: string) => {
    setMultipleDaysShift(selectedDates, shiftId);
    setShowShiftSelector(false);
    setIsSelectionMode(false);
    setSelectedDates([]);
  };

  return (
    <div className="h-full flex flex-col safe-area-top">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={goToToday}
            className="text-lg font-semibold text-gray-900 capitalize active:text-primary-600"
          >
            {formatMonthYear(currentMonth)}
          </button>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Selection mode banner */}
        {isSelectionMode && (
          <div className="mt-3 flex items-center justify-between bg-primary-50 rounded-lg px-3 py-2">
            <span className="text-sm text-primary-700 font-medium">
              {selectedDates.length} día{selectedDates.length !== 1 ? 's' : ''} seleccionado{selectedDates.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button
                onClick={cancelSelection}
                className="p-1.5 rounded-full bg-white text-gray-600 active:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={confirmSelection}
                className="p-1.5 rounded-full bg-primary-600 text-white active:bg-primary-700"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              'py-2 text-center text-xs font-medium',
              i >= 5 ? 'text-red-500' : 'text-gray-600'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="grid grid-cols-7 auto-rows-fr min-h-full">
          {days.map((date, index) => (
            <DayCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth(date, currentMonth)}
              isSelected={selectedDates.includes(formatDate(date))}
              isSelectionMode={isSelectionMode}
              onClick={() => handleDayClick(date)}
              onTouchStart={(e) => handleDayTouchStart(date, e)}
              onTouchMove={handleDayTouchMove}
              onTouchEnd={handleDayTouchEnd}
            />
          ))}
        </div>
      </div>

      {/* Day Editor Modal */}
      {editingDate && (
        <DayEditor
          date={editingDate}
          onClose={() => setEditingDate(null)}
        />
      )}

      {/* Shift Selector Modal */}
      {showShiftSelector && (
        <ShiftSelector
          onSelect={handleShiftSelected}
          onClose={() => setShowShiftSelector(false)}
        />
      )}
    </div>
  );
}
