import { useState } from 'react';
import { Player } from '../types';
import { 
  Checkbox 
} from './ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface PlayerSelectionProps {
  players: Player[];
  loading: boolean;
  onSelectPlayers: (players: string[]) => void;
}

export function PlayerSelection({ players, loading, onSelectPlayers }: PlayerSelectionProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handlePlayerToggle = (playerName: string) => {
    setSelectedPlayers(prev => {
      const newSelection = prev.includes(playerName)
        ? prev.filter(name => name !== playerName)
        : [...prev, playerName];
      
      onSelectPlayers(newSelection);
      return newSelection;
    });
  };

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <span role="img" aria-label="player" className="mr-2">🏃</span> Select Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <ScrollArea className="h-60 rounded-md">
            <div className="space-y-2">
              {players && players.map((player) => (
                // Ensure player has a unique id, otherwise use player name with position as fallback
                <div 
                  key={player.id || `player-${player.name}-${player.position}`} 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
                >
                  <Checkbox 
                    id={`player-${player.id || `${player.name}-${player.position}`}`} 
                    checked={selectedPlayers.includes(player.name)}
                    onCheckedChange={() => handlePlayerToggle(player.name)}
                    className="border-gray-600"
                  />
                  <label 
                    htmlFor={`player-${player.id || `${player.name}-${player.position}`}`}
                    className="text-sm font-medium leading-none text-white cursor-pointer flex-1"
                  >
                    {player.name} <span className="text-gray-400">({player.position})</span>
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}