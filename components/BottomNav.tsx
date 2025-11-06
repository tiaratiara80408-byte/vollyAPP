
import React from 'react';
import { View } from '../types';
import { HomeIcon, UsersIcon, CalendarIcon, ChartBarIcon, ClipboardListIcon } from './icons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-indigo-400';
  const inactiveClasses = 'text-gray-400 hover:text-indigo-400';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: View.Dashboard, label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { view: View.Team, label: 'Team', icon: <UsersIcon className="w-6 h-6" /> },
    { view: View.Matches, label: 'Matches', icon: <CalendarIcon className="w-6 h-6" /> },
    { view: View.Statistics, label: 'Stats', icon: <ChartBarIcon className="w-6 h-6" /> },
    { view: View.Training, label: 'Training', icon: <ClipboardListIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg max-w-lg mx-auto">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
   