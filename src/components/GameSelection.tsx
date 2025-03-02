// src/components/GameSelection.tsx
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
  onSelectGame: (gameId: string, opponent: string) => void;
}

export function GameSelection({ lastGame, recentGames, loading, onSelectGame }: GameSelectionProps) {
  const handleGameSelect = (gameId: string) => {
    const game = [lastGame, ...recentGames].find(g => g?.id === gameId);
    if (game) {
      onSelectGame(gameId, game.opponent);
    }
  };

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <span role="img" aria-label="calendar" className="mr-2">🗓️</span> Select Game
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <RadioGroup defaultValue={lastGame?.id} onValueChange={handleGameSelect}>
            {lastGame && (
              <div className="flex items-center space-x-2 p-2 rounded bg-gray-800 mb-2">
                <RadioGroupItem value={lastGame.id} id={`game-${lastGame.id}`} className="border-gray-600" />
                <Label htmlFor={`game-${lastGame.id}`} className="text-white cursor-pointer flex-1">
                  Last Game: vs {lastGame.opponent} ({lastGame.date})
                </Label>
              </div>
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
