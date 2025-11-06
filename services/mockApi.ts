import { Team, Match, Drill, Player, TrainingSession } from '../types';

let mockTeams: Team[] = [
  {
    id: 1,
    name: "Garuda Volley",
    category: "Professional",
    stats: { wins: 18, losses: 6 },
    roster: [
      { id: 1, name: "Ahmad Rizki", number: 1, position: "Setter", stats: { totalPoints: 145, aces: 28, blocks: 15, errors: 12, efficiency: 92 } },
      { id: 2, name: "Budi Santoso", number: 5, position: "Outside Hitter", stats: { totalPoints: 256, aces: 35, blocks: 20, errors: 25, efficiency: 88 } },
      { id: 3, name: "Citra Lestari", number: 10, position: "Libero", stats: { totalPoints: 25, aces: 2, blocks: 5, errors: 3, efficiency: 98 } },
      { id: 4, name: "Dewi Anggraini", number: 7, position: "Middle Blocker", stats: { totalPoints: 198, aces: 15, blocks: 55, errors: 18, efficiency: 90 } },
    ],
  },
];

let mockMatches: Match[] = [
  { id: 1, teamA: "Garuda Volley", teamB: "Nusantara Smashers", date: "2025-10-05", time: "15:00", location: "GOR Bhinneka", status: 'upcoming' },
  { id: 2, teamA: "Jakarta Thunder", teamB: "Garuda Volley", date: "2025-10-08", time: "18:00", location: "Istora Senayan", status: 'upcoming' },
  { id: 3, teamA: "Surabaya Fire", teamB: "Garuda Volley", date: "2025-09-28", time: "19:00", location: "DBL Arena", status: 'completed', result: { teamAScore: 2, teamBScore: 3, winner: 'Garuda Volley' } },
  { id: 4, teamA: "Garuda Volley", teamB: "Bandung Strikers", date: "2025-09-21", time: "16:00", location: "GOR Bhinneka", status: 'completed', result: { teamAScore: 3, teamBScore: 1, winner: 'Garuda Volley' } },
];

let mockDrills: Drill[] = [
  { id: 1, title: "Spike Technique Training", category: "Attacking", level: "Intermediate", description: "Latihan teknik spike untuk meningkatkan power dan akurasi.", duration: 30, players: "6-8 pemain", steps: ["Warm-up with light jogging and dynamic stretches.", "Practice approach footwork without the ball.", "Tosses for hitting, focusing on timing.", "Full approach and spike against a block.", "Cool-down with static stretches."] },
  { id: 2, title: "Blocking Drill", category: "Defense", level: "Advanced", description: "Latihan blocking timing dan positioning untuk menghentikan serangan lawan.", duration: 45, players: "4-6 pemain" },
  { id: 3, title: "Serve and Receive", category: "Fundamentals", level: "Beginner", description: "Fokus pada konsistensi servis dan penerimaan bola pertama yang akurat.", duration: 25, players: "Seluruh tim" },
];

let mockTrainingSessions: TrainingSession[] = [
    {id: 1, title: 'Team Practice', date: '2025-10-03', time: '17:00', location: 'Home Court'}
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500));

export const getTeams = (): Promise<Team[]> => simulateDelay(mockTeams);
export const getMatches = (): Promise<Match[]> => simulateDelay(mockMatches);
export const getDrills = (): Promise<Drill[]> => simulateDelay(mockDrills);
export const getTrainingSessions = (): Promise<TrainingSession[]> => simulateDelay(mockTrainingSessions);


export const addTeam = (team: Omit<Team, 'id' | 'roster' | 'stats'>): Promise<Team> => {
    const newTeam: Team = {
        ...team,
        id: Date.now(),
        roster: [],
        stats: { wins: 0, losses: 0 }
    };
    mockTeams.push(newTeam);
    return simulateDelay(newTeam);
};

export const addPlayerToTeam = (teamId: number, player: Omit<Player, 'id' | 'stats'>): Promise<Player> => {
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) return Promise.reject("Team not found");
    
    const newPlayer: Player = {
        ...player,
        id: Date.now(),
        stats: { totalPoints: 0, aces: 0, blocks: 0, errors: 0, efficiency: 0 }
    };
    team.roster.push(newPlayer);
    return simulateDelay(newPlayer);
};

export const addMatch = (match: Omit<Match, 'id' | 'status'>): Promise<Match> => {
    const newMatch: Match = {
        ...match,
        id: Date.now(),
        status: 'upcoming'
    };
    mockMatches.unshift(newMatch);
    return simulateDelay(newMatch);
};

export const updateMatchResult = (matchId: number, result: { teamAScore: number, teamBScore: number }): Promise<Match> => {
    const matchIndex = mockMatches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return Promise.reject("Match not found");

    const match = mockMatches[matchIndex];
    match.status = 'completed';
    const winner = result.teamAScore > result.teamBScore ? match.teamA : match.teamB;
    match.result = { ...result, winner };
    
    // Update team stats
    const updateStats = (teamName: string, won: boolean) => {
        const team = mockTeams.find(t => t.name === teamName);
        if(team) {
            if(won) team.stats.wins++;
            else team.stats.losses++;
        }
    };

    updateStats(match.teamA, winner === match.teamA);
    updateStats(match.teamB, winner === match.teamB);

    return simulateDelay(match);
};


export const addDrill = (drill: Omit<Drill, 'id'>): Promise<Drill> => {
    const newDrill: Drill = { ...drill, id: Date.now() };
    mockDrills.unshift(newDrill);
    return simulateDelay(newDrill);
};

export const addTrainingSession = (session: Omit<TrainingSession, 'id'>): Promise<TrainingSession> => {
    const newSession: TrainingSession = { ...session, id: Date.now() };
    mockTrainingSessions.unshift(newSession);
    return simulateDelay(newSession);
};
