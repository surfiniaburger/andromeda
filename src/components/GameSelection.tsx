import { Game } from '../types';
import {
  RadioGroup,
  RadioGroupItem
} from './ui/radio-group';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from './ui/card';
import { Label } from './ui/label';

interface GameSelectionProps {
  lastGame: Game | null;
  recentGames: Game[];
  loading: boolean;
  onSelectGame: (opponent: string) => void;
}

export function GameSelection({ lastGame, recentGames, loading, onSelectGame }: GameSelectionProps) {
  const handleGameSelect = (gameId: string) => {
    // Special case for "default" option
    if (gameId === "default") {
      if (lastGame) {
        onSelectGame(lastGame.opponent);
      }
      return;
    }

    const game = [lastGame, ...recentGames].find(g => g?.id === gameId);
    if (game) {
      onSelectGame(game.opponent);
    }
  };
  
  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <span role="img" aria-label="calendar" className="mr-2">🗓️</span> Select Game <span className="text-xs text-gray-400 ml-2">(Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <RadioGroup defaultValue="default" onValueChange={handleGameSelect}>
            <div className="flex items-center space-x-2 p-2 rounded bg-blue-900/30 mb-2">
              <RadioGroupItem value="default" id="game-default" className="border-gray-600" />
              <Label htmlFor="game-default" className="text-white cursor-pointer flex-1">
                Last game {lastGame ? `(vs ${lastGame.opponent})` : ''}
              </Label>
            </div>
            
            {lastGame && recentGames.length > 0 && (
              <div className="mt-2 mb-1 text-xs text-gray-400">Other recent games:</div>
            )}
            
            {recentGames.map((game) => (
              <div key={game.id} className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded">
                <RadioGroupItem value={game.id} id={`game-${game.id}`} className="border-gray-600" />
                <Label htmlFor={`game-${game.id}`} className="text-white cursor-pointer flex-1">
                  vs {game.opponent} ({game.date})
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}