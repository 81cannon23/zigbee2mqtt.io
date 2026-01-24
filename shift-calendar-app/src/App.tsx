import { useState } from 'react';
import { Calendar } from './components/Calendar';
import { Navigation } from './components/Navigation';
import { ShiftManager } from './components/ShiftManager';
import { FreeDayManager } from './components/FreeDayManager';
import { Statistics } from './components/Statistics';
import { ShiftSwapManager } from './components/ShiftSwapManager';
import { ExportManager } from './components/ExportManager';
import { Settings } from './components/Settings';

type Page = 'calendar' | 'shifts' | 'freeDays' | 'statistics' | 'swaps' | 'export' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('calendar');

  const renderPage = () => {
    switch (currentPage) {
      case 'calendar':
        return <Calendar />;
      case 'shifts':
        return <ShiftManager />;
      case 'freeDays':
        return <FreeDayManager />;
      case 'statistics':
        return <Statistics />;
      case 'swaps':
        return <ShiftSwapManager />;
      case 'export':
        return <ExportManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
