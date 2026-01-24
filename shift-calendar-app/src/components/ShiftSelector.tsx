import { X } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { getContrastColor } from '../utils/colors';

interface ShiftSelectorProps {
  onSelect: (shiftId: string) => void;
  onClose: () => void;
}

export function ShiftSelector({ onSelect, onClose }: ShiftSelectorProps) {
  const { shifts, freeDayTypes } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-t-2xl max-h-[70vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Seleccionar turno o día libre
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Shifts */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Turnos</h3>
            <div className="grid grid-cols-2 gap-3">
              {shifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => onSelect(shift.id)}
                  className="p-4 rounded-xl text-left active:scale-95 transition-transform"
                  style={{
                    backgroundColor: shift.color,
                    color: getContrastColor(shift.color),
                  }}
                >
                  <span className="font-bold text-xl">{shift.shortName}</span>
                  <br />
                  <span className="text-sm opacity-80">{shift.name}</span>
                  <br />
                  <span className="text-xs opacity-60">
                    {shift.startTime} - {shift.endTime}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Free days */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">
              Días libres
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {freeDayTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onSelect(type.id)}
                  className="p-4 rounded-xl text-left active:scale-95 transition-transform"
                  style={{
                    backgroundColor: type.color,
                    color: getContrastColor(type.color),
                  }}
                >
                  <span className="font-bold text-xl">{type.shortName}</span>
                  <br />
                  <span className="text-sm opacity-80">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
