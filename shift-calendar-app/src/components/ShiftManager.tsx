import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { SHIFT_COLORS, getContrastColor } from '../utils/colors';
import { cn } from '../utils/cn';
import type { Shift } from '../types';

export function ShiftManager() {
  const { shifts, addShift, updateShift, deleteShift } = useStore();
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setEditingShift({
      id: `shift-${Date.now()}`,
      name: '',
      shortName: '',
      color: SHIFT_COLORS[shifts.length % SHIFT_COLORS.length],
      startTime: '08:00',
      endTime: '16:00',
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingShift || !editingShift.name || !editingShift.shortName) return;

    if (isCreating) {
      addShift(editingShift);
    } else {
      updateShift(editingShift.id, editingShift);
    }

    setEditingShift(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este turno?')) {
      deleteShift(id);
    }
  };

  return (
    <div className="h-full flex flex-col safe-area-top bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Gestión de Turnos</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium active:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </header>

      {/* Shift list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                style={{
                  backgroundColor: shift.color,
                  color: getContrastColor(shift.color),
                }}
              >
                {shift.shortName}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{shift.name}</h3>
                <p className="text-sm text-gray-500">
                  {shift.startTime} - {shift.endTime}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingShift(shift);
                    setIsCreating(false);
                  }}
                  className="p-2 text-gray-500 active:bg-gray-100 rounded-lg"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(shift.id)}
                  className="p-2 text-red-500 active:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {shifts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay turnos creados.
            <br />
            Pulsa "Nuevo" para crear uno.
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <button
                onClick={() => {
                  setEditingShift(null);
                  setIsCreating(false);
                }}
                className="p-1 text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-semibold text-gray-900">
                {isCreating ? 'Nuevo turno' : 'Editar turno'}
              </h2>
              <button onClick={handleSave} className="p-1 text-primary-600">
                <Check className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editingShift.name}
                  onChange={(e) =>
                    setEditingShift({ ...editingShift, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ej: Mañana"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Abreviatura
                </label>
                <input
                  type="text"
                  value={editingShift.shortName}
                  onChange={(e) =>
                    setEditingShift({
                      ...editingShift,
                      shortName: e.target.value.slice(0, 3),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ej: M"
                  maxLength={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Hora inicio
                  </label>
                  <input
                    type="time"
                    value={editingShift.startTime}
                    onChange={(e) =>
                      setEditingShift({
                        ...editingShift,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Hora fin
                  </label>
                  <input
                    type="time"
                    value={editingShift.endTime}
                    onChange={(e) =>
                      setEditingShift({
                        ...editingShift,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {SHIFT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setEditingShift({ ...editingShift, color })
                      }
                      className={cn(
                        'w-full aspect-square rounded-lg border-2 transition-all',
                        editingShift.color === color
                          ? 'border-gray-900 scale-110'
                          : 'border-transparent'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700">
                  Vista previa
                </label>
                <div
                  className="mt-2 p-4 rounded-lg text-center"
                  style={{
                    backgroundColor: editingShift.color,
                    color: getContrastColor(editingShift.color),
                  }}
                >
                  <span className="font-bold text-2xl">
                    {editingShift.shortName || '?'}
                  </span>
                  <br />
                  <span className="text-sm opacity-80">
                    {editingShift.name || 'Nombre del turno'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
