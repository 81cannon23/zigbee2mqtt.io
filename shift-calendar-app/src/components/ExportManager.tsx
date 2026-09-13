import { useState } from 'react';
import { Image, Check, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { CalendarExport } from './CalendarExport';
import { MONTH_NAMES } from '../utils/dateUtils';
import { cn } from '../utils/cn';

export function ExportManager() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [exportType, setExportType] = useState<'monthly' | 'annual'>('monthly');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const toggleMonth = (month: number) => {
    setSelectedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month].sort((a, b) => a - b)
    );
  };

  const selectAllMonths = () => {
    setSelectedMonths([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  };

  const clearSelection = () => {
    setSelectedMonths([]);
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const shareImage = async (dataUrl: string, filename: string) => {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Calendario de Turnos',
        });
      } else {
        // Fallback to download
        downloadImage(dataUrl, filename);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      downloadImage(dataUrl, filename);
    }
  };

  const exportMonthly = async () => {
    if (selectedMonths.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);

    for (let i = 0; i < selectedMonths.length; i++) {
      const month = selectedMonths[i];

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 100));

      const element = document.getElementById(`export-month-${month}`);
      if (element) {
        try {
          const dataUrl = await toPng(element, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
          });

          const filename = `calendario_${selectedYear}_${String(month + 1).padStart(2, '0')}_${MONTH_NAMES[month]}.png`;

          if (selectedMonths.length === 1) {
            await shareImage(dataUrl, filename);
          } else {
            downloadImage(dataUrl, filename);
          }
        } catch (error) {
          console.error('Error exporting month:', error);
        }
      }

      setExportProgress(((i + 1) / selectedMonths.length) * 100);
    }

    setIsExporting(false);
  };

  const exportAnnual = async () => {
    setIsExporting(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const element = document.getElementById('export-annual');
    if (element) {
      try {
        const dataUrl = await toPng(element, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });

        const filename = `calendario_anual_${selectedYear}.png`;
        await shareImage(dataUrl, filename);
      } catch (error) {
        console.error('Error exporting annual:', error);
      }
    }

    setIsExporting(false);
  };

  const handleExport = () => {
    if (exportType === 'monthly') {
      exportMonthly();
    } else {
      exportAnnual();
    }
  };

  return (
    <div className="h-full flex flex-col safe-area-top bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Exportar Calendario</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Year selector */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="text-sm font-medium text-gray-700">Año</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Export type */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="text-sm font-medium text-gray-700">
            Tipo de exportación
          </label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => setExportType('monthly')}
              className={cn(
                'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                exportType === 'monthly'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700'
              )}
            >
              <Image className="w-5 h-5 mx-auto mb-1" />
              Mensual
            </button>
            <button
              onClick={() => setExportType('annual')}
              className={cn(
                'p-3 rounded-lg border-2 text-sm font-medium transition-all',
                exportType === 'annual'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-700'
              )}
            >
              <Image className="w-5 h-5 mx-auto mb-1" />
              Anual
            </button>
          </div>
        </div>

        {/* Month selection (only for monthly export) */}
        {exportType === 'monthly' && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Meses a exportar
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAllMonths}
                  className="text-xs text-primary-600 font-medium"
                >
                  Todos
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={clearSelection}
                  className="text-xs text-gray-500 font-medium"
                >
                  Ninguno
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTH_NAMES.map((name, index) => (
                <button
                  key={index}
                  onClick={() => toggleMonth(index)}
                  className={cn(
                    'p-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1',
                    selectedMonths.includes(index)
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-700 active:bg-gray-50'
                  )}
                >
                  {selectedMonths.includes(index) && (
                    <Check className="w-3 h-3" />
                  )}
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Export info */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
          {exportType === 'monthly' ? (
            <>
              Se generará una imagen JPG por cada mes seleccionado.
              {selectedMonths.length === 1 &&
                ' Podrás compartir directamente o guardar.'}
            </>
          ) : (
            <>
              Se generará una imagen JPG con todos los meses del año.
              Incluye todos los días incluyendo domingos.
            </>
          )}
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Exportando...</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(exportProgress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Export button */}
      <div className="p-4 bg-white border-t border-gray-200 safe-area-bottom">
        <button
          onClick={handleExport}
          disabled={isExporting || (exportType === 'monthly' && selectedMonths.length === 0)}
          className={cn(
            'w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all',
            isExporting || (exportType === 'monthly' && selectedMonths.length === 0)
              ? 'bg-gray-200 text-gray-500'
              : 'bg-primary-600 text-white active:bg-primary-700'
          )}
        >
          <Share2 className="w-5 h-5" />
          {isExporting ? 'Exportando...' : 'Exportar y Compartir'}
        </button>
      </div>

      {/* Hidden export elements */}
      <div className="fixed left-[-9999px] top-0">
        {exportType === 'monthly' &&
          selectedMonths.map((month) => (
            <div key={month} id={`export-month-${month}`}>
              <CalendarExport year={selectedYear} month={month} />
            </div>
          ))}
        {exportType === 'annual' && (
          <div id="export-annual">
            <CalendarExport year={selectedYear} isAnnual />
          </div>
        )}
      </div>
    </div>
  );
}
