import React, { useState, useEffect, useCallback } from 'react';
import { View, Team, Match, Drill } from './types';
import { getTeams, getMatches, getDrills } from './services/mockApi';

import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import TeamManagement from './components/TeamManagement';
import Matches from './components/Matches';
import Statistics from './components/Statistics';
import Training from './components/Training';
import Login from './components/Login';
import { LogoutIcon } from './components/icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [teamsData, matchesData, drillsData] = await Promise.all([
        getTeams(),
        getMatches(),
        getDrills(),
      ]);
      setTeams(teamsData);
      setMatches(matchesData);
      setDrills(drillsData);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView(View.Dashboard); // Reset to default view on logout
  };


  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    const currentTeam = teams[0]; // Assuming we're managing the first team for simplicity

    if (!currentTeam) {
        return (
            <div className="p-4">
                <p className="text-center text-gray-400">No team data available. Please create a team.</p>
                {/* A simplified team management view could be shown here to force team creation */}
                <TeamManagement team={null} onUpdate={fetchData} />
            </div>
        );
    }

    switch (activeView) {
      case View.Dashboard:
        return <Dashboard team={currentTeam} matches={matches} />;
      case View.Team:
        return <TeamManagement team={currentTeam} onUpdate={fetchData} />;
      case View.Matches:
        return <Matches team={currentTeam} matches={matches} onUpdate={fetchData} />;
      case View.Statistics:
        return <Statistics team={currentTeam} />;
      case View.Training:
        return <Training drills={drills} onUpdate={fetchData} />;
      default:
        return <Dashboard team={currentTeam} matches={matches} />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-50 min-h-screen font-sans">
      <div className="container mx-auto max-w-lg pb-24">
        <header className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10 p-4 flex justify-between items-center border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">VolleyApp</h1>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors flex items-center">
                <LogoutIcon className="w-5 h-5 mr-2" />
                Logout
            </button>
        </header>
        <main>{renderView()}</main>
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;
