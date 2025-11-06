
import React from 'react';
import { Team, Match } from '../types';
import { TrophyIcon, ChartPieIcon } from './icons';

const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
    changeColor?: string;
}> = ({ icon, label, value, change, changeColor = 'text-green-400' }) => (
    <div className="bg-gray-800 p-4 rounded-xl flex items-center">
        <div className="bg-gray-700 p-3 rounded-lg mr-4">{icon}</div>
        <div>
            <div className="text-sm text-gray-400">{label}</div>
            <div className="text-2xl font-bold flex items-center">
                {value}
                {change && <span className={`text-xs ml-2 font-semibold ${changeColor}`}>{change}</span>}
            </div>
        </div>
    </div>
);

const MatchCard: React.FC<{ match: Match }> = ({ match }) => (
    <div className="bg-gray-800 p-4 rounded-lg mb-3">
        <div className="text-xs text-gray-400 mb-2">Upcoming</div>
        <div className="flex justify-between items-center">
            <div className="text-center">
                <div className="font-bold">{match.teamA}</div>
            </div>
            <div className="text-gray-400 font-mono text-sm">VS</div>
            <div className="text-center">
                <div className="font-bold">{match.teamB}</div>
            </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-3 border-t border-gray-700 pt-2">
            {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {match.time}
            <br />
            {match.location}
        </div>
    </div>
);

interface DashboardProps {
    team: Team;
    matches: Match[];
}

const Dashboard: React.FC<DashboardProps> = ({ team, matches }) => {
    const totalMatches = team.stats.wins + team.stats.losses;
    const winRate = totalMatches > 0 ? Math.round((team.stats.wins / totalMatches) * 100) : 0;
    const upcomingMatches = matches.filter(m => m.status === 'upcoming');

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Selamat datang di VolleyApp</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <StatCard 
                    icon={<TrophyIcon className="w-6 h-6 text-yellow-400" />}
                    label="Total Pertandingan"
                    value={totalMatches}
                    change="+3"
                />
                <StatCard 
                    icon={<TrophyIcon className="w-6 h-6 text-green-400" />}
                    label="Menang"
                    value={team.stats.wins}
                    change="+2"
                />
                 <StatCard 
                    icon={<ChartPieIcon className="w-6 h-6 text-indigo-400" />}
                    label="Win Rate"
                    value={`${winRate}%`}
                    change="+5%"
                />
            </div>
            
            <div>
                <h2 className="text-lg font-semibold mb-3">Pertandingan Mendatang</h2>
                {upcomingMatches.length > 0 ? (
                    upcomingMatches.map(match => <MatchCard key={match.id} match={match} />)
                ) : (
                    <p className="text-gray-500 text-center py-4">Tidak ada pertandingan mendatang.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
   