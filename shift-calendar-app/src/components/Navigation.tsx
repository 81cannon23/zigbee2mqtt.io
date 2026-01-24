import { Calendar, Clock, BarChart3, ArrowLeftRight, Download, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

type Page = 'calendar' | 'shifts' | 'freeDays' | 'statistics' | 'swaps' | 'export' | 'settings';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; icon: typeof Calendar; label: string }[] = [
  { page: 'calendar', icon: Calendar, label: 'Calendario' },
  { page: 'shifts', icon: Clock, label: 'Turnos' },
  { page: 'statistics', icon: BarChart3, label: 'Resumen' },
  { page: 'swaps', icon: ArrowLeftRight, label: 'Cambios' },
  { page: 'export', icon: Download, label: 'Exportar' },
  { page: 'settings', icon: Settings, label: 'Ajustes' },
];

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="safe-area-bottom bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex justify-around items-center">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={cn(
              'flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-[60px]',
              currentPage === page
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-500 active:bg-gray-100'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
