
import React, { useState } from 'react';
import { Team, Player } from '../types';

interface StatisticsProps {
  team: Team;
}

const PlayerStatCard: React.FC<{ player: Player }> = ({ player }) => (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">{player.number}</div>
                <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-sm text-gray-400">{player.position}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold">{player.stats.totalPoints}</p>
                <p className="text-sm text-gray-400">Total Poin</p>
            </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-sm pt-3 border-t border-gray-700">
            <div>
                <p className="font-semibold">{player.stats.aces}</p>
                <p className="text-xs text-gray-400">Aces</p>
            </div>
            <div>
                <p className="font-semibold">{player.stats.blocks}</p>
                <p className="text-xs text-gray-400">Blocks</p>
            </div>
            <div>
                <p className="font-semibold">{player.stats.errors}</p>
                <p className="text-xs text-gray-400">Errors</p>
            </div>
            <div>
                <p className="font-semibold text-green-400">{player.stats.efficiency}%</p>
                <p className="text-xs text-gray-400">Efisiensi</p>
            </div>
        </div>
    </div>
);


const Statistics: React.FC<StatisticsProps> = ({ team }) => {
    const [activeTab, setActiveTab] = useState<'team' | 'player'>('team');
    const totalMatches = team.stats.wins + team.stats.losses;

    return (
        <div className="p-4 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Statistik</h1>
                <p className="text-gray-400">Analisis performa tim dan pemain</p>
            </header>

             <div className="flex bg-gray-800 rounded-lg p-1">
                <button 
                    onClick={() => setActiveTab('team')}
                    className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${activeTab === 'team' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    Tim
                </button>
                <button 
                    onClick={() => setActiveTab('player')}
                    className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${activeTab === 'player' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    Pemain
                </button>
            </div>
            
            {activeTab === 'team' && (
                <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-400">Total Pertandingan</p>
                        <p className="text-4xl font-bold">{totalMatches}</p>
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-400">Menang</p>
                        <p className="text-4xl font-bold text-green-400">{team.stats.wins}</p>
                    </div>
                     <div className="bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-400">Kalah</p>
                        <p className="text-4xl font-bold text-red-400">{team.stats.losses}</p>
                    </div>
                </div>
            )}

            {activeTab === 'player' && (
                 <div>
                    <h2 className="text-lg font-semibold mb-4">Detail Performa Individual</h2>
                    {team.roster.sort((a,b) => b.stats.totalPoints - a.stats.totalPoints).map(player => (
                        <PlayerStatCard key={player.id} player={player}/>
                    ))}
                 </div>
            )}
        </div>
    );
};

export default Statistics;
   