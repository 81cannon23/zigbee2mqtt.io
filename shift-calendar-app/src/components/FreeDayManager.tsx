import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { FREE_DAY_COLORS, getContrastColor } from '../utils/colors';
import { cn } from '../utils/cn';
import type { FreeDayType } from '../types';

export function FreeDayManager() {
  const { freeDayTypes, addFreeDayType, updateFreeDayType, deleteFreeDayType } =
    useStore();
  const [editingType, setEditingType] = useState<FreeDayType | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setEditingType({
      id: `free-${Date.now()}`,
      name: '',
      shortName: '',
      color: FREE_DAY_COLORS[freeDayTypes.length % FREE_DAY_COLORS.length],
      countMode: 'days',
      defaultHours: 8,
    });
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingType || !editingType.name || !editingType.shortName) return;

    if (isCreating) {
      addFreeDayType(editingType);
    } else {
      updateFreeDayType(editingType.id, editingType);
    }

    setEditingType(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este tipo de día libre?')) {
      deleteFreeDayType(id);
    }
  };

  return (
    <div className="h-full flex flex-col safe-area-top bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Días Libres</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium active:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>
      </header>

      {/* Type list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {freeDayTypes.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                style={{
                  backgroundColor: type.color,
                  color: getContrastColor(type.color),
                }}
              >
                {type.shortName}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500">
                  Cuenta por {type.countMode === 'days' ? 'días' : 'horas'}
                  {type.countMode === 'hours' &&
                    ` (${type.defaultHours}h por defecto)`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingType(type);
                    setIsCreating(false);
                  }}
                  className="p-2 text-gray-500 active:bg-gray-100 rounded-lg"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(type.id)}
                  className="p-2 text-red-500 active:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {freeDayTypes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay tipos de días libres.
            <br />
            Pulsa "Nuevo" para crear uno.
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <button
                onClick={() => {
                  setEditingType(null);
                  setIsCreating(false);
                }}
                className="p-1 text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="font-semibold text-gray-900">
                {isCreating ? 'Nuevo día libre' : 'Editar día libre'}
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
                  value={editingType.name}
                  onChange={(e) =>
                    setEditingType({ ...editingType, name: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ej: Vacaciones"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Abreviatura
                </label>
                <input
                  type="text"
                  value={editingType.shortName}
                  onChange={(e) =>
                    setEditingType({
                      ...editingType,
                      shortName: e.target.value.slice(0, 3),
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ej: V"
                  maxLength={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Modo de conteo
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() =>
                      setEditingType({ ...editingType, countMode: 'days' })
                    }
                    className={cn(
                      'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                      editingType.countMode === 'days'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-700'
                    )}
                  >
                    Por días
                  </button>
                  <button
                    onClick={() =>
                      setEditingType({ ...editingType, countMode: 'hours' })
                    }
                    className={cn(
                      'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                      editingType.countMode === 'hours'
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-700'
                    )}
                  >
                    Por horas
                  </button>
                </div>
              </div>

              {editingType.countMode === 'hours' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Horas por defecto
                  </label>
                  <input
                    type="number"
                    value={editingType.defaultHours}
                    onChange={(e) =>
                      setEditingType({
                        ...editingType,
                        defaultHours: Number(e.target.value),
                      })
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    min="1"
                    max="24"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {FREE_DAY_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setEditingType({ ...editingType, color })
                      }
                      className={cn(
                        'w-full aspect-square rounded-lg border-2 transition-all',
                        editingType.color === color
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
                    backgroundColor: editingType.color,
                    color: getContrastColor(editingType.color),
                  }}
                >
                  <span className="font-bold text-2xl">
                    {editingType.shortName || '?'}
                  </span>
                  <br />
                  <span className="text-sm opacity-80">
                    {editingType.name || 'Nombre'}
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
