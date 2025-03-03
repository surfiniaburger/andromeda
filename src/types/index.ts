// src/types/index.ts
export interface Team {
    id: string;
    name: string;
    abbreviation: string;
  }
  
  export interface Player {
    id: string;
    name: string;
    position: string;
  }
  
  export interface Game {
    id: string;
    date: string;
    opponent: string;
    type: string;
  }
  
  export interface PodcastRequest {
    team: string;
    players: string[];
    timeframe: string;
    game_type: string;
    language: string;
    opponent: string;
  }
  
  export interface PodcastResponse {
    url: string;
    duration: number;
    title?: string;
    audio_url?: string;
    message?: string;
  }