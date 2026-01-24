import { useState } from 'react';
import { Plus, Trash2, X, Check, ArrowLeftRight } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { formatDisplayDate, parseDate, formatDate } from '../utils/dateUtils';
import { getContrastColor } from '../utils/colors';
import type { ShiftSwap } from '../types';

export function ShiftSwapManager() {
  const { shiftSwaps, shifts, addShiftSwap, removeShiftSwap } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const [dateWorkedForCoworker, setDateWorkedForCoworker] = useState('');
  const [shiftWorked, setShiftWorked] = useState('');
  const [dateCoworkerWorksForUser, setDateCoworkerWorksForUser] = useState('');
  const [coworkerId, setCoworkerId] = useState('');

  const handleCreate = () => {
    if (
      !dateWorkedForCoworker ||
      !shiftWorked ||
      !dateCoworkerWorksForUser ||
      !coworkerId
    ) {
      return;
    }

    const swap: ShiftSwap = {
      id: `swap-${Date.now()}`,
      dateWorkedForCoworker,
      shiftWorked,
      dateCoworkerWorksForUser,
      coworkerId: Number(coworkerId),
      createdAt: new Date().toISOString(),
    };

    addShiftSwap(swap);
    resetForm();
  };

  const resetForm = () => {
    setDateWorkedForCoworker('');
    setShiftWorked('');
    setDateCoworkerWorksForUser('');
    setCoworkerId('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este cambio de turno?')) {
      removeShiftSwap(id);
    }
  };

  const getShiftInfo = (shiftId: string) => {
    return shifts.find((s) => s.id === shiftId);
  };

  return (
    <div className="h-full flex flex-col safe-area-top bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Cambios de Turno</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium active:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </header>

      {/* Swap list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {shiftSwaps.map((swap) => {
          const shift = getShiftInfo(swap.shiftWorked);
          return (
            <div
              key={swap.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Compañero #{swap.coworkerId}
                    </span>
                    {shift && (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: shift.color,
                          color: getContrastColor(shift.color),
                        }}
                      >
                        {shift.shortName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1">
                      <p className="text-gray-500">Yo trabajo:</p>
                      <p className="font-medium text-gray-900">
                        {formatDisplayDate(parseDate(swap.dateWorkedForCoworker))}
                      </p>
                    </div>
                    <ArrowLeftRight className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-gray-500">Él trabaja:</p>
                      <p className="font-medium text-gray-900">
                        {formatDisplayDate(parseDate(swap.dateCoworkerWorksForUser))}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(swap.id)}
                  className="p-2 text-red-500 active:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {shiftSwaps.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay cambios de turno registrados.
            <br />
            <span className="text-sm">
              Los cambios de turno permiten intercambiar días de trabajo con compañeros.
            </span>
          </div>
        )}
      </div>

      {/* Create modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <button onClick={resetForm} className="p-1 text-gray-500">
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-semibold text-gray-900">
                Nuevo cambio de turno
              </h2>
              <button onClick={handleCreate} className="p-1 text-primary-600">
                <Check className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                Un cambio de turno intercambia un día de trabajo con un compañero.
                Tú trabajas un día por él, y él trabaja otro día por ti.
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Número de compañero
                </label>
                <input
                  type="number"
                  value={coworkerId}
                  onChange={(e) => setCoworkerId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ej: 1234"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Día que YO trabajo por él
                </h3>
                <input
                  type="date"
                  value={dateWorkedForCoworker}
                  onChange={(e) => setDateWorkedForCoworker(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <label className="text-sm font-medium text-gray-700 mt-3 block">
                  Turno que trabajo
                </label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {shifts.map((shift) => (
                    <button
                      key={shift.id}
                      onClick={() => setShiftWorked(shift.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        shiftWorked === shift.id
                          ? 'border-gray-900'
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: shift.color,
                        color: getContrastColor(shift.color),
                      }}
                    >
                      <span className="font-bold">{shift.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Día que ÉL trabaja por mí
                </h3>
                <input
                  type="date"
                  value={dateCoworkerWorksForUser}
                  onChange={(e) => setDateCoworkerWorksForUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este día se te quitará tu turno asignado automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
