import { useState, useEffect } from 'react';
import { useMLBApi } from '../hooks/useMLBApi';
import { TeamSelection } from './TeamSelection';
import { PlayerSelection } from './PlayerSelection';
import { GameSelection } from './GameSelection';
import { LanguageSelection } from './LanguageSelection';
import { AudioPlayer } from './AudioPlayer';
import { DebugConsole } from './DebugConsole';
import { Button } from './ui/button';
import { PodcastRequest, PodcastResponse } from '../types';
import { Alert, AlertDescription } from './ui/alert';

export function PodcastForm() {
  const {
    teams,
    players,
    lastGame,
    recentGames,
    loading,
    error,
    debugInfo,
    fetchTeams,
    fetchPlayers,
    fetchLastGame,
    fetchRecentGames,
    generatePodcast,
  } = useMLBApi();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PodcastRequest>({
    team: '',
    players: [],
    timeframe: 'Last game',
    game_type: 'Regular Season',
    language: 'english',
    opponent: '',
  });
  const [generatedPodcast, setGeneratedPodcast] = useState<PodcastResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playersLoaded, setPlayersLoaded] = useState(false);
  const [gamesLoaded, setGamesLoaded] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null); // Local error state for component-specific errors

  // Only fetch teams on initial component mount
  useEffect(() => {
    fetchTeams().catch(err => {
      setLocalError(`Failed to fetch teams: ${err.message}`);
    });
  }, [fetchTeams]);

  // Handle team selection - only fetch when moving to step 1
  const handleTeamSelect = (team: string) => {
    setFormData(prev => ({ ...prev, team }));
    setPlayersLoaded(false);
    setGamesLoaded(false);
    setLocalError(null); // Clear any previous errors
    setCurrentStep(1);
  };

  // Fetch player data only when we're on step 1 and players aren't already loaded
  useEffect(() => {
    if (currentStep === 1 && formData.team && !playersLoaded) {
      fetchPlayers(formData.team)
        .then(() => setPlayersLoaded(true))
        .catch(err => {
          setLocalError(`Failed to fetch players: ${err.message}`);
        });
    }
  }, [currentStep, formData.team, fetchPlayers, playersLoaded]);

  // Fetch game data only when we're on step 1 and games aren't already loaded
  useEffect(() => {
    if (currentStep === 1 && formData.team && !gamesLoaded) {
      // We'll handle each call separately to prevent one failure from blocking the other
      fetchLastGame(formData.team)
        .catch(err => {
          console.error(`Error fetching last game: ${err.message}`);
          // We don't want to block the entire flow for this error
        });
      
      fetchRecentGames(formData.team)
        .then(() => setGamesLoaded(true))
        .catch(err => {
          console.error(`Error fetching recent games: ${err.message}`);
          // Still mark games as loaded even if there was an error to prevent infinite retries
          setGamesLoaded(true);
        });
    }
  }, [currentStep, formData.team, fetchLastGame, fetchRecentGames, gamesLoaded]);

  // Update opponent and game_type when last game is loaded
  useEffect(() => {
    if (lastGame && currentStep === 1) {
      setFormData(prev => ({
        ...prev,
        opponent: lastGame.opponent || prev.opponent,
        game_type: lastGame.type || prev.game_type,
      }));
    }
  }, [lastGame, currentStep]);

  const handlePlayerSelect = (players: string[]) => {
    setFormData(prev => ({ ...prev, players }));
  };

  const handleGameSelect = (opponent: string) => {
    setFormData(prev => ({ ...prev, opponent }));
  };

  const handleLanguageSelect = (language: string) => {
    setFormData(prev => ({ ...prev, language }));
  };

  const handleGeneratePodcast = async () => {
    setIsGenerating(true);
    setLocalError(null);
    try {
      const result = await generatePodcast(formData);
      if (result) {
        setGeneratedPodcast(result);
        setCurrentStep(3);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate podcast';
      setLocalError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TeamSelection
            teams={teams}
            loading={loading}
            onSelectTeam={handleTeamSelect}
          />
        );
      case 1:
        // Show loading state while data is being fetched
        { const isLoadingData = !playersLoaded || loading;
        return (
          <>
            <PlayerSelection
              players={players}
              loading={isLoadingData}
              onSelectPlayers={handlePlayerSelect}
            />
            <GameSelection
              lastGame={lastGame}
              recentGames={recentGames}
              loading={!gamesLoaded || loading}
              onSelectGame={handleGameSelect}
            />
            <LanguageSelection
              onSelectLanguage={handleLanguageSelect}
            />
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={formData.players.length === 0 || isLoadingData}
              >
                Next
              </Button>
            </div>
          </>
        ); }
      case 2:
        return (
          <>
            <div className="rounded-lg bg-gray-800 p-4 text-white">
              <h3 className="text-lg font-semibold mb-2">Podcast Summary</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Team:</span> {formData.team}</p>
                <p><span className="font-medium">Players:</span> {formData.players.join(', ')}</p>
                <p><span className="font-medium">Opponent:</span> {formData.opponent}</p>
                <p><span className="font-medium">Game Type:</span> {formData.game_type}</p>
                <p><span className="font-medium">Language:</span> {formData.language}</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleGeneratePodcast}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-white rounded-full"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Podcast'
                )}
              </Button>
            </div>
          </>
        );
      case 3:
        return generatedPodcast ? (
          <>
            <AudioPlayer
              audioUrl={generatedPodcast.url}
              title={generatedPodcast.title}
            />
            <Button
              onClick={() => setCurrentStep(0)}
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 w-full"
            >
              Create New Podcast
            </Button>
          </>
        ) : null;
      default:
        return null;
    }
  };

  // Use either the global error from useMLBApi or the local error
  const displayError = error || localError;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-24">
      <div className="mb-2">
        {currentStep <= 2 && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of 3
            </div>
            <div className="flex space-x-1">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-8 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {displayError && (
        <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
          <AlertDescription>
            {displayError}
          </AlertDescription>
        </Alert>
      )}
      
      {renderStep()}
      
      <DebugConsole debugInfo={debugInfo} />
    </div>
  );
}