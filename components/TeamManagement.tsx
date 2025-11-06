import React, { useState } from 'react';
import { Team, Player } from '../types';
import { PlusIcon } from './icons';
import Modal from './Modal';
import { addTeam, addPlayerToTeam } from '../services/mockApi';

interface TeamManagementProps {
    team: Team | null;
    onUpdate: () => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ team, onUpdate }) => {
    const [isAddTeamModalOpen, setAddTeamModalOpen] = useState(false);
    const [isAddPlayerModalOpen, setAddPlayerModalOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamCategory, setNewTeamCategory] = useState('');
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    const [newPlayerPosition, setNewPlayerPosition] = useState('');

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName || !newTeamCategory) return;
        await addTeam({ name: newTeamName, category: newTeamCategory });
        setNewTeamName('');
        setNewTeamCategory('');
        onUpdate();
        setAddTeamModalOpen(false);
    };
    
    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!team || !newPlayerName || !newPlayerNumber || !newPlayerPosition) return;
        const player: Omit<Player, 'id'|'stats'> = {
            name: newPlayerName,
            number: parseInt(newPlayerNumber, 10),
            position: newPlayerPosition
        };
        await addPlayerToTeam(team.id, player);
        setNewPlayerName('');
        setNewPlayerNumber('');
        setNewPlayerPosition('');
        onUpdate();
        setAddPlayerModalOpen(false);
    };

    if (!team) {
         return (
            <div className="p-4 space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Tim</h1>
                        <p className="text-gray-400">Buat tim pertama Anda untuk memulai.</p>
                    </div>
                    <button onClick={() => setAddTeamModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2"/>
                        Buat Tim Baru
                    </button>
                </header>
                 <Modal title="Buat Tim Baru" isOpen={isAddTeamModalOpen} onClose={() => setAddTeamModalOpen(false)}>
                    <form onSubmit={handleAddTeam} className="space-y-4">
                        <div>
                            <label htmlFor="teamName" className="block text-sm font-medium text-gray-300">Nama Tim</label>
                            <input type="text" id="teamName" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Kategori</label>
                            <input type="text" id="category" value={newTeamCategory} onChange={e => setNewTeamCategory(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Professional" required />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Buat Tim</button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }
    
    const totalPlayers = team.roster.length;
    const winRate = (team.stats.wins + team.stats.losses) > 0 ? Math.round((team.stats.wins / (team.stats.wins + team.stats.losses)) * 100) : 0;
    
    return (
        <div className="p-4 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tim</h1>
                    <p className="text-gray-400">Kelola tim dan roster pemain</p>
                </div>
                <button onClick={() => setAddTeamModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Buat Tim Baru
                </button>
            </header>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Total Pemain</div>
                    <div className="text-2xl font-bold">{totalPlayers}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Menang / Kalah</div>
                    <div className="text-2xl font-bold">{team.stats.wins} / {team.stats.losses}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">Win Rate</div>
                    <div className="text-2xl font-bold">{winRate}%</div>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Roster - {team.name}</h2>
                    <button onClick={() => setAddPlayerModalOpen(true)} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center text-sm">
                        <PlusIcon className="w-4 h-4 mr-1"/>
                        Tambah Pemain
                    </button>
                </div>
                <ul className="divide-y divide-gray-700">
                    {team.roster.length > 0 ? team.roster.map(player => (
                        <li key={player.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{player.name}</p>
                                <p className="text-sm text-gray-400">#{player.number} - {player.position}</p>
                            </div>
                        </li>
                    )) : <p className="text-center text-gray-500 py-4">No players on the roster yet.</p>}
                </ul>
            </div>
            
             <Modal title="Buat Tim Baru" isOpen={isAddTeamModalOpen} onClose={() => setAddTeamModalOpen(false)}>
                <form onSubmit={handleAddTeam} className="space-y-4">
                    {/* Form fields identical to the !team case */}
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-300">Nama Tim</label>
                        <input type="text" id="teamName" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Kategori</label>
                        <input type="text" id="category" value={newTeamCategory} onChange={e => setNewTeamCategory(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Professional" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Buat Tim</button>
                    </div>
                </form>
            </Modal>

            <Modal title="Tambah Pemain Baru" isOpen={isAddPlayerModalOpen} onClose={() => setAddPlayerModalOpen(false)}>
                <form onSubmit={handleAddPlayer} className="space-y-4">
                    <div>
                        <label htmlFor="playerName" className="block text-sm font-medium text-gray-300">Nama Pemain</label>
                        <input type="text" id="playerName" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                    </div>
                     <div>
                        <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-300">Nomor Punggung</label>
                        <input type="number" id="playerNumber" value={newPlayerNumber} onChange={e => setNewPlayerNumber(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                    </div>
                     <div>
                        <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-300">Posisi</label>
                        <input type="text" id="playerPosition" value={newPlayerPosition} onChange={e => setNewPlayerPosition(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" placeholder="e.g., Setter" required />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Tambah</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TeamManagement;
