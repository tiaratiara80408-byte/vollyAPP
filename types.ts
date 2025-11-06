export enum View {
  Dashboard,
  Team,
  Matches,
  Statistics,
  Training,
}

export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  stats: {
    totalPoints: number;
    aces: number;
    blocks: number;
    errors: number;
    efficiency: number;
  };
}

export interface Team {
  id: number;
  name: string;
  category: string;
  roster: Player[];
  stats: {
    wins: number;
    losses: number;
  };
}

export interface Match {
  id: number;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed';
  result?: {
    teamAScore: number;
    teamBScore: number;
    winner: string;
  };
}

export interface Drill {
  id: number;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  duration: number; // in minutes
  players: string;
  steps?: string[];
}

export interface TrainingSession {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
}
