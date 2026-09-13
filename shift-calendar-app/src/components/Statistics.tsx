import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { getContrastColor } from '../utils/colors';

export function Statistics() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { calculateStatistics, shifts, freeDayTypes } = useStore();

  const stats = useMemo(() => calculateStatistics(year), [year, calculateStatistics]);

  const formatHours = (hours: number) => {
    return hours.toFixed(1).replace('.0', '');
  };

  return (
    <div className="h-full flex flex-col safe-area-top bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setYear(year - 1)}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <h1 className="text-xl font-bold text-gray-900">Resumen {year}</h1>

          <button
            onClick={() => setYear(year + 1)}
            className="p-2 rounded-full active:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main stats */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Resumen General
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.workedDays}
              </p>
              <p className="text-sm text-gray-500">Días trabajados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatHours(stats.workedHours)}h
              </p>
              <p className="text-sm text-gray-500">Horas trabajadas</p>
            </div>
          </div>
        </div>

        {/* Night hours */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Horas Nocturnas
          </h2>
          <p className="text-2xl font-bold text-purple-600">
            {formatHours(stats.nightHours)}h
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Calculado automáticamente (00:00 - 08:00)
          </p>
        </div>

        {/* Holiday hours */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Festivos Trabajados
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.holidaysWorkedDays}
              </p>
              <p className="text-sm text-gray-500">Días</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {formatHours(stats.holidaysWorkedHours)}h
              </p>
              <p className="text-sm text-gray-500">Horas</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Domingos completos + Sábados desde 14:30 + Festivos personalizados
          </p>
        </div>

        {/* Extra hours */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Horas Adicionales
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Horas extra</span>
              <span className="font-semibold text-gray-900">
                {formatHours(stats.horasExtra)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Horas extraordinarias</span>
              <span className="font-semibold text-gray-900">
                {formatHours(stats.horasExtraordinarias)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Compensación horaria</span>
              <span className="font-semibold text-gray-900">
                {formatHours(stats.compensacionHoraria)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Horas de exclusividad</span>
              <span className="font-semibold text-gray-900">
                {formatHours(stats.horasExclusividad)}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Bolsa de horas</span>
              <span className="font-semibold text-gray-900">
                {formatHours(stats.bolsaHoras)}h
              </span>
            </div>
          </div>
        </div>

        {/* Shifts breakdown */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Desglose por Turno
          </h2>
          <div className="space-y-2">
            {shifts.map((shift) => {
              const count = stats.shiftCounts[shift.id] || 0;
              return (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ backgroundColor: `${shift.color}20` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: shift.color,
                        color: getContrastColor(shift.color),
                      }}
                    >
                      {shift.shortName}
                    </span>
                    <span className="text-gray-700">{shift.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {count} días
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Free days breakdown */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Desglose de Días Libres
          </h2>
          <div className="space-y-2">
            {freeDayTypes.map((type) => {
              const count = stats.freeDayCounts[type.id] || { days: 0, hours: 0 };
              return (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: type.color,
                        color: getContrastColor(type.color),
                      }}
                    >
                      {type.shortName}
                    </span>
                    <span className="text-gray-700">{type.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {type.countMode === 'days'
                      ? `${count.days} días`
                      : `${formatHours(count.hours)}h`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
