import { useState, useRef, useCallback } from 'react';
import { Team, Game, PodcastResponse, PodcastRequest } from '../types';

const API_BASE_URL = 'https://mlb-strings-1011675918473.us-central1.run.app/api/v1';

export const useMLBApi = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [lastGame, setLastGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [podcast, setPodcast] = useState<PodcastResponse | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    endpoint: string;
    status: number;
    data: unknown;
    timestamp: string;
  }[]>([]);

  // Cache references to prevent duplicate API calls
  const cache = useRef<{
    teams: Team[] | null;
    players: Record<string, string[]>;
    lastGame: Record<string, Game>;
  }>({
    teams: null,
    players: {},
    lastGame: {}
  });

  // Track if API calls are in progress
  const pendingRequests = useRef<Record<string, boolean>>({});

  const addDebugInfo = useCallback((endpoint: string, status: number, data: unknown) => {
    const timestamp = new Date().toISOString();
    setDebugInfo(prev => [...prev, { endpoint, status, data, timestamp }]);
  }, []);

  // Convert string teams to Team objects
  const processTeamStrings = useCallback((teamData: unknown[]): Team[] => {
    return teamData.map(team => {
      if (typeof team === 'string') {
        // Create properly formatted Team object from string
        const teamName = team.trim();
        return {
          name: teamName,
          id: `team-${teamName.replace(/\s+/g, '-').toLowerCase()}`,
          abbreviation: teamName.split(' ').map(word => word[0]).join('').toUpperCase()
        } as Team;
      }
      return team as Team;
    });
  }, []);

  const fetchTeams = useCallback(async (forceRefresh = false) => {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && cache.current.teams !== null) {
      return cache.current.teams;
    }

    // Prevent duplicate requests
    const cacheKey = 'teams';
    if (pendingRequests.current[cacheKey]) {
      console.log('Teams request already in progress');
      return null;
    }

    pendingRequests.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    const endpoint = `${API_BASE_URL}/teams`;
    
    try {
      console.log(`Fetching: ${endpoint}`);
      const response = await fetch(endpoint);
      const status = response.status;
      console.log(`Response status: ${status}`);
      
      if (!response.ok) throw new Error(`Failed to fetch teams: ${status}`);
      
      const responseData = await response.json();
      console.log('Teams data:', responseData);
      addDebugInfo(endpoint, status, responseData);
      
      // Handle both possible response formats
      let teamsArray: unknown[] = [];
      if (Array.isArray(responseData)) {
        teamsArray = responseData;
      } else if (responseData && typeof responseData === 'object') {
        // Check for nested data structure like { data: { teams: [] }, status: 'success' }
        if (responseData.data && Array.isArray(responseData.data.teams)) {
          teamsArray = responseData.data.teams;
        } else if (responseData.teams && Array.isArray(responseData.teams)) {
          teamsArray = responseData.teams;
        } else {
          throw new Error('Unexpected response format: teams array not found');
        }
      } else {
        throw new Error('Invalid response format');
      }
      
      // Process string teams into proper Team objects
      const processedTeams = processTeamStrings(teamsArray);
      
      // Update cache and state
      cache.current.teams = processedTeams;
      setTeams(processedTeams);
      return processedTeams;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error(`Error fetching teams: ${errorMessage}`);
      setError(errorMessage);
      addDebugInfo(endpoint, 0, { error: errorMessage });
      return null;
    } finally {
      setLoading(false);
      pendingRequests.current[cacheKey] = false;
    }
  }, [addDebugInfo, processTeamStrings]);

  const fetchPlayers = useCallback(async (teamName: string, forceRefresh = false) => {
    // Return cached data if available and not forcing refresh
    const cacheKey = `players-${teamName}`;
    if (!forceRefresh && cache.current.players[teamName]) {
      return cache.current.players[teamName];
    }

    // Prevent duplicate requests
    if (pendingRequests.current[cacheKey]) {
      console.log(`Players request for ${teamName} already in progress`);
      return null;
    }

    pendingRequests.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    const endpoint = `${API_BASE_URL}/teams/${teamName}/players`;
    
    try {
      console.log(`Fetching: ${endpoint}`);
      const response = await fetch(endpoint);
      const status = response.status;
      console.log(`Response status: ${status}`);
      
      if (!response.ok) throw new Error(`Failed to fetch players: ${status}`);
      
      const responseData = await response.json();
      console.log('Players data:', responseData);
      addDebugInfo(endpoint, status, responseData);
      
      // Handle both possible response formats
      let playersArray: string[];
      if (Array.isArray(responseData)) {
        playersArray = responseData;
      } else if (responseData && typeof responseData === 'object') {
        if (responseData.data && Array.isArray(responseData.data.players)) {
          playersArray = responseData.data.players;
        } else if (responseData.players && Array.isArray(responseData.players)) {
          playersArray = responseData.players;
        } else {
          throw new Error('Unexpected response format: players array not found');
        }
      } else {
        throw new Error('Invalid response format');
      }
      
      // Update cache and state
      cache.current.players[teamName] = playersArray;
      setPlayers(playersArray);
      return playersArray;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error(`Error fetching players: ${errorMessage}`);
      setError(errorMessage);
      addDebugInfo(endpoint, 0, { error: errorMessage });
      return null;
    } finally {
      setLoading(false);
      pendingRequests.current[cacheKey] = false;
    }
  }, [addDebugInfo]);

  const fetchLastGame = useCallback(async (teamName: string, forceRefresh = false) => {
    // Return cached data if available and not forcing refresh
    const cacheKey = `lastGame-${teamName}`;
    if (!forceRefresh && cache.current.lastGame[teamName]) {
      return cache.current.lastGame[teamName];
    }

    // Prevent duplicate requests
    if (pendingRequests.current[cacheKey]) {
      console.log(`Last game request for ${teamName} already in progress`);
      return null;
    }

    pendingRequests.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    const endpoint = `${API_BASE_URL}/teams/${teamName}/games/last`;
    
    try {
      console.log(`Fetching: ${endpoint}`);
      const response = await fetch(endpoint);
      const status = response.status;
      console.log(`Response status: ${status}`);
      
      if (!response.ok) throw new Error(`Failed to fetch last game: ${status}`);
      
      const responseData = await response.json();
      console.log('Last game data:', responseData);
      addDebugInfo(endpoint, status, responseData);
      
      // Handle possible nested response format
      let gameData: Game;
      if (responseData && typeof responseData === 'object') {
        if (responseData.data && responseData.data.game) {
          gameData = responseData.data.game;
        } else {
          gameData = responseData;
        }
      } else {
        throw new Error('Invalid response format');
      }
      
      // Update cache and state
      cache.current.lastGame[teamName] = gameData;
      setLastGame(gameData);
      return gameData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error(`Error fetching last game: ${errorMessage}`);
      setError(errorMessage);
      addDebugInfo(endpoint, 0, { error: errorMessage });
      return null;
    } finally {
      setLoading(false);
      pendingRequests.current[cacheKey] = false;
    }
  }, [addDebugInfo]);
  
  const generatePodcast = useCallback(async (requestData: PodcastRequest) => {
    setLoading(true);
    setError(null);
    const endpoint = `${API_BASE_URL}/podcast`;
    const cacheKey = `podcast-${JSON.stringify(requestData)}`;
    
    // Prevent duplicate requests
    if (pendingRequests.current[cacheKey]) {
      console.log('Podcast generation already in progress');
      return null;
    }
    
    pendingRequests.current[cacheKey] = true;
    
    try {
      console.log(`Posting to: ${endpoint}`);
      console.log('Request data:', requestData);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const status = response.status;
      console.log(`Response status: ${status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Failed to generate podcast: ${status}. ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Podcast data:', responseData);
      addDebugInfo(endpoint, status, responseData);
      
      // Transform the response data to match expected PodcastResponse format
      let podcastData: PodcastResponse;
      
      if (responseData && typeof responseData === 'object') {
        // Handle case where audio_url is directly in responseData.data
        if (responseData.data && responseData.data.audio_url) {
          podcastData = {
            url: responseData.data.audio_url,
            audio_url: responseData.data.audio_url, // Keep original field too
            title: `MLB Podcast: ${requestData.team}`,
            message: responseData.data.message || responseData.message || "Podcast generated successfully",
            ...responseData.data // Include any other fields from the response
          };
        } 
        // Handle case where response has nested podcast object
        else if (responseData.data && responseData.data.podcast) {
          const nested = responseData.data.podcast;
          podcastData = {
            url: nested.audio_url || nested.url,
            audio_url: nested.audio_url || nested.url,
            title: nested.title || `MLB Podcast: ${requestData.team}`,
            message: nested.message || responseData.message || "Podcast generated successfully",
            ...nested
          };
        } 
        // Default case: assume responseData is the podcast object
        else {
          podcastData = {
            url: responseData.audio_url || responseData.url,
            audio_url: responseData.audio_url || responseData.url,
            title: responseData.title || `MLB Podcast: ${requestData.team}`,
            message: responseData.message || "Podcast generated successfully",
            ...responseData
          };
        }
      } else {
        throw new Error('Invalid response format');
      }
      
      // Add debug log to see final transformed data
      console.log('Transformed podcast data for UI:', podcastData);
      
      setPodcast(podcastData);
      return podcastData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error(`Error generating podcast: ${errorMessage}`);
      setError(errorMessage);
      addDebugInfo(endpoint, 0, { error: errorMessage });
      return null;
    } finally {
      setLoading(false);
      pendingRequests.current[cacheKey] = false;
    }
  }, [addDebugInfo]);

  // Clear cache method for when needed
  const clearCache = useCallback(() => {
    cache.current = {
      teams: null,
      players: {},
      lastGame: {}
    };
  }, []);

  return {
    teams,
    players,
    lastGame,
    loading,
    error,
    podcast,
    debugInfo,
    fetchTeams,
    fetchPlayers,
    fetchLastGame,
    generatePodcast,
    clearCache
  };
};