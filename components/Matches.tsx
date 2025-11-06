import React, { useState } from 'react';
import { Match, Team } from '../types';
import { PlusIcon } from './icons';
import Modal from './Modal';
import { addMatch, updateMatchResult } from '../services/mockApi';

interface MatchesProps {
  team: Team;
  matches: Match[];
  onUpdate: () => void;
}

const MatchCard: React.FC<{ match: Match, onStart: () => void }> = ({ match, onStart }) => {
    const isWinner = (teamName: string) => match.result?.winner === teamName;

    return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
                <div className={`text-center w-2/5 ${isWinner(match.teamA) ? 'font-bold text-green-400' : ''}`}>
                    <p>{match.teamA}</p>
                    {match.status === 'completed' && <p className="text-2xl">{match.result?.teamAScore}</p>}
                </div>
                <div className="text-gray-400 font-mono text-sm">VS</div>
                 <div className={`text-center w-2/5 ${isWinner(match.teamB) ? 'font-bold text-green-400' : ''}`}>
                    <p>{match.teamB}</p>
                    {match.status === 'completed' && <p className="text-2xl">{match.result?.teamBScore}</p>}
                </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-3 border-t border-gray-700 pt-2">
                {new Date(match.date).toLocaleDateString()} @ {match.time}
                <br />
                {match.location}
            </div>
            {match.status === 'upcoming' && 
                <button onClick={onStart} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mt-4 transition-colors">
                    Mulai Pertandingan
                </button>
            }
        </div>
    );
};

const Matches: React.FC<MatchesProps> = ({ team, matches, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isScoreModalOpen, setScoreModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Form states for scheduling
  const [teamB, setTeamB] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  
  // Form states for scoring
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');

  const handleOpenScoreModal = (match: Match) => {
    setSelectedMatch(match);
    setScoreModalOpen(true);
  };
  
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMatch({ teamA: team.name, teamB, date, time, location });
    onUpdate();
    setTeamB(''); setDate(''); setTime(''); setLocation('');
    setScheduleModalOpen(false);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedMatch) return;
      await updateMatchResult(selectedMatch.id, {
          teamAScore: parseInt(scoreA, 10),
          teamBScore: parseInt(scoreB, 10)
      });
      onUpdate();
      setScoreA(''); setScoreB('');
      setScoreModalOpen(false);
      setSelectedMatch(null);
  }

  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const completedMatches = matches.filter(m => m.status === 'completed');
  
  const displayedMatches = activeTab === 'upcoming' ? upcomingMatches : completedMatches;

  return (
    <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white">Pertandingan</h1>
                <p className="text-gray-400">Jadwal dan hasil pertandingan</p>
            </div>
            <button onClick={() => setScheduleModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                <PlusIcon className="w-5 h-5 mr-2"/>
                Jadwalkan
            </button>
        </header>

        <div className="flex bg-gray-800 rounded-lg p-1">
            <button 
                onClick={() => setActiveTab('upcoming')}
                className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${activeTab === 'upcoming' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                Mendatang
            </button>
            <button 
                onClick={() => setActiveTab('completed')}
                className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${activeTab === 'completed' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
                Selesai
            </button>
        </div>

        <div>
            {displayedMatches.length > 0 ? (
                displayedMatches.map(match => <MatchCard key={match.id} match={match} onStart={() => handleOpenScoreModal(match)} />)
            ) : (
                <p className="text-gray-500 text-center py-8">Tidak ada pertandingan dalam kategori ini.</p>
            )}
        </div>
        
        <Modal title="Jadwalkan Pertandingan Baru" isOpen={isScheduleModalOpen} onClose={() => setScheduleModalOpen(false)}>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-300">Tim Lawan</label>
                    <input type="text" value={teamB} onChange={e => setTeamB(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Tanggal</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Waktu</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Lokasi</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                </div>
                 <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Jadwalkan</button>
                </div>
            </form>
        </Modal>

        <Modal title="Masukkan Hasil Pertandingan" isOpen={isScoreModalOpen} onClose={() => setScoreModalOpen(false)}>
            {selectedMatch && (
                <form onSubmit={handleScoreSubmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4 text-center">
                         <div>
                            <label className="block font-medium text-gray-300">{selectedMatch.teamA}</label>
                            <input type="number" value={scoreA} onChange={e => setScoreA(e.target.value)} className="mt-1 w-full text-center text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-300">{selectedMatch.teamB}</label>
                            <input type="number" value={scoreB} onChange={e => setScoreB(e.target.value)} className="mt-1 w-full text-center text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Simpan Hasil</button>
                    </div>
                </form>
            )}
        </Modal>

    </div>
  );
};

export default Matches;
