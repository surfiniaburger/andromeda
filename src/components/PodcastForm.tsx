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

  // Simplified to just 2 steps: team selection and configuration
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
  const [dataLoading, setDataLoading] = useState({
    players: false,
    games: false
  });
  const [localError, setLocalError] = useState<string | null>(null);

  // Only fetch teams on initial component mount
  useEffect(() => {
    fetchTeams().catch(err => {
      setLocalError(`Failed to fetch teams: ${err.message}`);
    });
  }, [fetchTeams]);

  // Handle team selection - now this is the main required input
  const handleTeamSelect = (team: string) => {
    setFormData(prev => ({ ...prev, team }));
    setDataLoading({
      players: true,
      games: true
    });
    setLocalError(null);
    setCurrentStep(1);
    
    // Fetch players and games data after team selection
    fetchPlayers(team)
      .finally(() => {
        setDataLoading(prev => ({ ...prev, players: false }));
      });
    
    // Fetch last game and recent games data
    Promise.all([
      fetchLastGame(team),
      fetchRecentGames(team)
    ])
    .finally(() => {
      setDataLoading(prev => ({ ...prev, games: false }));
    });
  };

  // Update opponent and game_type when last game is loaded
  useEffect(() => {
    if (lastGame && currentStep === 1) {
      // Default to the last game's information
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
    
    // Validate required fields before submitting
    if (!formData.team) {
      setLocalError("Team selection is required");
      setIsGenerating(false);
      return;
    }
    
    if (!formData.language) {
      setLocalError("Language selection is required");
      setIsGenerating(false);
      return;
    }
    
    // If no game/opponent is selected, use the last game
    const requestData = {
      ...formData,
      opponent: formData.opponent || (lastGame?.opponent || ''),
      game_type: formData.game_type || (lastGame?.type || 'Regular Season')
    };
    
    try {
      const result = await generatePodcast(requestData);
      if (result) {
        setGeneratedPodcast(result);
        setCurrentStep(2); // Go to the audio player step
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate podcast';
      setLocalError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
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
        return (
          <>
            <div className="space-y-4">
              {/* Required field */}
              <div>
                <h3 className="text-sm text-white font-medium mb-2 flex items-center">
                  <span className="text-red-500 mr-1">*</span> Required Field
                </h3>
                <LanguageSelection
                  onSelectLanguage={handleLanguageSelect}
                />
              </div>
              
              {/* Optional fields */}
              <div>
                <h3 className="text-sm text-white font-medium mb-2">Optional Fields</h3>
                
                <div className="space-y-4">
                  <GameSelection
                    lastGame={lastGame}
                    recentGames={recentGames}
                    loading={dataLoading.games || loading}
                    onSelectGame={handleGameSelect}
                  />
                  
                  <PlayerSelection
                    players={players}
                    loading={dataLoading.players || loading}
                    onSelectPlayers={handlePlayerSelect}
                  />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-800 p-4 text-white mt-6">
              <h3 className="text-lg font-semibold mb-2">Podcast Summary</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Team:</span> {formData.team}</p>
                <p><span className="font-medium">Language:</span> {formData.language}</p>
                <p><span className="font-medium">Game:</span> {formData.opponent ? `vs ${formData.opponent}` : 'Last game'}</p>
                {formData.players.length > 0 && (
                  <p><span className="font-medium">Players:</span> {formData.players.join(', ')}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="bg-transparent text-white border-gray-700 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleGeneratePodcast}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isGenerating || !formData.language}
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
      case 2:
        return generatedPodcast ? (
          <>
            <AudioPlayer
              audioUrl={generatedPodcast.audio_url || generatedPodcast.url}
              title={`MLB Podcast: ${formData.team}`}
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

  // Display either global or local error
  const displayError = error || localError;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 pb-24">
      <div className="mb-2">
        {currentStep <= 1 && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of 2
            </div>
            <div className="flex space-x-1">
              {[0, 1].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-12 rounded-full ${
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