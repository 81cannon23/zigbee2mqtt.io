import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { parseDate, formatDisplayDate, isSunday, isSaturday } from '../utils/dateUtils';
import { getContrastColor } from '../utils/colors';
import { cn } from '../utils/cn';

interface DayEditorProps {
  date: string;
  onClose: () => void;
}

export function DayEditor({ date, onClose }: DayEditorProps) {
  const {
    dayData,
    shifts,
    freeDayTypes,
    customHolidays,
    setDayData,
    clearDayData,
    addCustomHoliday,
    removeCustomHoliday,
  } = useStore();

  const data = dayData[date] || {
    date,
    horasExtra: 0,
    horasExtraordinarias: 0,
    compensacionHoraria: 0,
    horasExclusividad: 0,
    bolsaHoras: 0,
  };

  const [selectedShiftId, setSelectedShiftId] = useState(data.shiftId || '');
  const [selectedFreeDayId, setSelectedFreeDayId] = useState(
    data.freeDay?.typeId || ''
  );
  const [freeDayHours, setFreeDayHours] = useState(data.freeDay?.hours || 8);
  const [horasExtra, setHorasExtra] = useState(data.horasExtra || 0);
  const [horasExtraordinarias, setHorasExtraordinarias] = useState(
    data.horasExtraordinarias || 0
  );
  const [compensacionHoraria, setCompensacionHoraria] = useState(
    data.compensacionHoraria || 0
  );
  const [horasExclusividad, setHorasExclusividad] = useState(
    data.horasExclusividad || 0
  );
  const [bolsaHoras, setBolsaHoras] = useState(data.bolsaHoras || 0);
  const [notes, setNotes] = useState(data.notes || '');
  const [isCustomHoliday, setIsCustomHoliday] = useState(
    customHolidays.some((h) => h.date === date)
  );
  const [customHolidayName, setCustomHolidayName] = useState(
    customHolidays.find((h) => h.date === date)?.name || ''
  );

  const parsedDate = parseDate(date);

  const selectedFreeDay = freeDayTypes.find((t) => t.id === selectedFreeDayId);

  const handleSave = () => {
    setDayData(date, {
      shiftId: selectedShiftId || undefined,
      freeDay: selectedFreeDayId
        ? { typeId: selectedFreeDayId, hours: freeDayHours }
        : undefined,
      horasExtra,
      horasExtraordinarias,
      compensacionHoraria,
      horasExclusividad,
      bolsaHoras,
      notes: notes || undefined,
    });

    if (isCustomHoliday && customHolidayName) {
      addCustomHoliday({ date, name: customHolidayName });
    } else if (!isCustomHoliday) {
      removeCustomHoliday(date);
    }

    onClose();
  };

  const handleClear = () => {
    clearDayData(date);
    removeCustomHoliday(date);
    onClose();
  };

  const handleShiftSelect = (shiftId: string) => {
    setSelectedShiftId(shiftId === selectedShiftId ? '' : shiftId);
    if (shiftId) setSelectedFreeDayId('');
  };

  const handleFreeDaySelect = (freeDayId: string) => {
    setSelectedFreeDayId(freeDayId === selectedFreeDayId ? '' : freeDayId);
    if (freeDayId) {
      setSelectedShiftId('');
      const freeDay = freeDayTypes.find((t) => t.id === freeDayId);
      if (freeDay) {
        setFreeDayHours(freeDay.defaultHours);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button onClick={onClose} className="p-1 text-gray-500">
            <X className="w-6 h-6" />
          </button>
          <h2 className="font-semibold text-gray-900 capitalize">
            {formatDisplayDate(parsedDate)}
          </h2>
          <button onClick={handleClear} className="p-1 text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Holiday indicator */}
          {(isSunday(parsedDate) || isSaturday(parsedDate)) && (
            <div
              className={cn(
                'p-3 rounded-lg text-sm',
                isSunday(parsedDate)
                  ? 'bg-red-50 text-red-700'
                  : 'bg-orange-50 text-orange-700'
              )}
            >
              {isSunday(parsedDate)
                ? 'Domingo - Festivo completo'
                : 'Sábado - Festivo desde las 14:30'}
            </div>
          )}

          {/* Custom holiday toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Marcar como festivo
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isCustomHoliday}
                onChange={(e) => setIsCustomHoliday(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {isCustomHoliday && (
            <input
              type="text"
              placeholder="Nombre del festivo"
              value={customHolidayName}
              onChange={(e) => setCustomHolidayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          )}

          {/* Shift selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Turno</h3>
            <div className="grid grid-cols-3 gap-2">
              {shifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => handleShiftSelect(shift.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all',
                    selectedShiftId === shift.id
                      ? 'border-gray-900'
                      : 'border-transparent'
                  )}
                  style={{
                    backgroundColor: shift.color,
                    color: getContrastColor(shift.color),
                  }}
                >
                  <span className="font-bold text-lg">{shift.shortName}</span>
                  <br />
                  <span className="text-xs opacity-80">{shift.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Free day selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Día libre
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {freeDayTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleFreeDaySelect(type.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all',
                    selectedFreeDayId === type.id
                      ? 'border-gray-900'
                      : 'border-transparent'
                  )}
                  style={{
                    backgroundColor: type.color,
                    color: getContrastColor(type.color),
                  }}
                >
                  <span className="font-bold text-lg">{type.shortName}</span>
                  <br />
                  <span className="text-xs opacity-80">{type.name}</span>
                </button>
              ))}
            </div>

            {selectedFreeDay && selectedFreeDay.countMode === 'hours' && (
              <div className="mt-3">
                <label className="text-xs text-gray-600">
                  Horas de este día libre
                </label>
                <input
                  type="number"
                  value={freeDayHours}
                  onChange={(e) => setFreeDayHours(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>
            )}
          </div>

          {/* Hours inputs */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Horas</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Horas extra</label>
                <input
                  type="number"
                  value={horasExtra}
                  onChange={(e) => setHorasExtra(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">
                  Horas extraordinarias
                </label>
                <input
                  type="number"
                  value={horasExtraordinarias}
                  onChange={(e) =>
                    setHorasExtraordinarias(Number(e.target.value))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">
                  Compensación horaria
                </label>
                <input
                  type="number"
                  value={compensacionHoraria}
                  onChange={(e) =>
                    setCompensacionHoraria(Number(e.target.value))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  step="0.5"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">
                  Horas de exclusividad
                </label>
                <input
                  type="number"
                  value={horasExclusividad}
                  onChange={(e) =>
                    setHorasExclusividad(Number(e.target.value))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-gray-600">Bolsa de horas</label>
                <input
                  type="number"
                  value={bolsaHoras}
                  onChange={(e) => setBolsaHoras(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              rows={2}
              placeholder="Añadir notas..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 safe-area-bottom">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg active:bg-primary-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
