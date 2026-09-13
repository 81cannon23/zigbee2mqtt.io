import { Trash2, AlertTriangle, Info, Calendar, Clock, Sun } from 'lucide-react';
import { useStore } from '../stores/useStore';

export function Settings() {
  const { customHolidays, removeCustomHoliday, freeDayTypes } = useStore();

  const handleResetAll = () => {
    if (confirm('¿Estás seguro? Se borrarán TODOS los datos. Esta acción no se puede deshacer.')) {
      localStorage.removeItem('shift-calendar-storage');
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col safe-area-top bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Ajustes</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h2 className="font-semibold text-gray-900">
                Calendario de Turnos
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Aplicación personal para gestionar turnos de trabajo.
                Todos los datos se guardan localmente en tu dispositivo.
              </p>
            </div>
          </div>
        </div>

        {/* Holiday rules info */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            Reglas de Festivos
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Domingos:</strong> Festivo completo (24h)</p>
            <p>• <strong>Sábados:</strong> Festivo desde las 14:30</p>
            <p>• <strong>Festivos personalizados:</strong> Los que añadas manualmente</p>
          </div>
        </div>

        {/* Night hours info */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Horas Nocturnas
          </h2>
          <p className="text-sm text-gray-600">
            Se calculan automáticamente según el horario del turno.
            Se considera horario nocturno de <strong>00:00 a 08:00</strong>.
          </p>
        </div>

        {/* Free day types link */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Tipos de Días Libres
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Tienes {freeDayTypes.length} tipo(s) de días libres configurados.
            Puedes gestionarlos desde la sección "Días Libres" en el menú inferior.
          </p>
        </div>

        {/* Custom holidays */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">
            Festivos Personalizados
          </h2>
          {customHolidays.length > 0 ? (
            <div className="space-y-2">
              {customHolidays.map((holiday) => (
                <div
                  key={holiday.date}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{holiday.name}</p>
                    <p className="text-xs text-gray-500">{holiday.date}</p>
                  </div>
                  <button
                    onClick={() => removeCustomHoliday(holiday.date)}
                    className="p-2 text-red-500 active:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No hay festivos personalizados. Puedes añadirlos al editar un día en el calendario.
            </p>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <h2 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona de Peligro
          </h2>
          <p className="text-sm text-red-600 mb-3">
            Esta acción borrará todos los datos de la aplicación: turnos, días libres, festivos y configuración.
          </p>
          <button
            onClick={handleResetAll}
            className="w-full py-2 bg-red-600 text-white font-medium rounded-lg active:bg-red-700 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Borrar todos los datos
          </button>
        </div>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            Versión 1.0.0
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            designed by 1076
          </p>
        </div>
      </div>
    </div>
  );
}
