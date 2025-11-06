import React, { useState } from 'react';
import { Drill } from '../types';
import { PlusIcon, SparklesIcon } from './icons';
import { addDrill, addTrainingSession } from '../services/mockApi';
import { GoogleGenAI, Type } from "@google/genai";
import Modal from './Modal';


interface TrainingProps {
  drills: Drill[];
  onUpdate: () => void;
}

const DrillCard: React.FC<{ drill: Drill }> = ({ drill }) => {
  const levelColor = {
    'Beginner': 'bg-green-500',
    'Intermediate': 'bg-yellow-500',
    'Advanced': 'bg-red-500'
  }[drill.level];

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{drill.category}</p>
          <p className="font-bold text-lg">{drill.title}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${levelColor}`}>{drill.level}</span>
      </div>
      <p className="text-sm text-gray-300 my-3">{drill.description}</p>
      {drill.steps && drill.steps.length > 0 && (
        <div className="my-3">
            <h4 className="font-semibold text-sm mb-1">Steps:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
                {drill.steps.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-400 pt-3 border-t border-gray-700">
        <span>Durasi: {drill.duration} menit</span>
        <span>Pemain: {drill.players}</span>
      </div>
    </div>
  );
};

const AiDrillModal: React.FC<{ onClose: () => void, onDrillCreated: (drill: Omit<Drill, 'id'>) => void }> = ({ onClose, onDrillCreated }) => {
    const [focus, setFocus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!focus) {
            setError('Please enter a focus area.');
            return;
        }
        if (!process.env.API_KEY) {
            setError('API key is not configured.');
            return;
        }
        setLoading(true);
        setError('');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate a detailed volleyball drill for my team. The focus should be on: "${focus}". Provide a title, category (like Attacking, Defense, or Serving), difficulty level (Beginner, Intermediate, or Advanced), a short description, estimated duration in minutes, a suggested number of players, and 5-7 clear, concise steps for the drill.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            category: { type: Type.STRING },
                            level: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                            description: { type: Type.STRING },
                            duration: { type: Type.INTEGER },
                            players: { type: Type.STRING },
                            steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["title", "category", "level", "description", "duration", "players", "steps"]
                    }
                }
            });

            const drillData = JSON.parse(response.text);
            const newDrill: Omit<Drill, 'id'> = drillData;
            onDrillCreated(newDrill);

        } catch (e) {
            console.error(e);
            setError('Failed to generate drill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold">Generate Drill with AI</h2>
                <p className="text-sm text-gray-400">Describe a focus area for the new drill (e.g., "improving back-row attacks" or "fast transition defense").</p>
                <div>
                    <input 
                        type="text"
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        placeholder="e.g., side-out consistency"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors">Cancel</button>
                    <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed">
                        {loading ? (
                            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Generating...</>
                        ) : (
                           <><SparklesIcon className="w-5 h-5 mr-2" /> Generate</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


const Training: React.FC<TrainingProps> = ({ drills, onUpdate }) => {
    const [showAiModal, setShowAiModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    
    // Form state for scheduling
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');


    const handleDrillCreated = async (drill: Omit<Drill, 'id'>) => {
        await addDrill(drill);
        onUpdate();
        setShowAiModal(false);
    };

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addTrainingSession({ title, date, time, location });
        onUpdate();
        setTitle(''); setDate(''); setTime(''); setLocation('');
        setShowScheduleModal(false);
    };

    return (
        <div className="p-4 space-y-6">
            {showAiModal && <AiDrillModal onClose={() => setShowAiModal(false)} onDrillCreated={handleDrillCreated} />}
             <Modal title="Jadwalkan Sesi Latihan" isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)}>
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300">Judul Sesi</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2" required />
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
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">Buat Jadwal</button>
                    </div>
                </form>
            </Modal>


            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Latihan</h1>
                    <p className="text-gray-400">Program latihan dan drill library</p>
                </div>
                <button onClick={() => setShowScheduleModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Jadwalkan Sesi
                </button>
            </header>
            
            <button 
                onClick={() => setShowAiModal(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
            >
                <SparklesIcon className="w-6 h-6 mr-2" />
                Suggest a New Drill with AI
            </button>
            
            <div>
                <h2 className="text-lg font-semibold mb-4">Drill Library</h2>
                {drills.map(drill => (
                    <DrillCard key={drill.id} drill={drill} />
                ))}
            </div>
        </div>
    );
};

export default Training;
