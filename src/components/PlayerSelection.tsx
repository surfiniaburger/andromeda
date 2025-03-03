import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface PlayerSelectionProps {
  players: string[];
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
        <CardTitle className="text-xl text-white flex items-center justify-between">
          <div>
            <span role="img" aria-label="player" className="mr-2">🏃</span> Select Players
          </div>
          <span className="text-xs text-gray-400">(Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : players.length > 0 ? (
          <>
            <ScrollArea className="h-48 rounded-md">
              <div className="space-y-2">
                {players.map((playerName, index) => (
                  <div
                    key={`player-${index}-${playerName}`}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
                  >
                    <Checkbox
                      id={`player-${index}-${playerName}`}
                      checked={selectedPlayers.includes(playerName)}
                      onCheckedChange={() => handlePlayerToggle(playerName)}
                      className="border-gray-600"
                    />
                    <label
                      htmlFor={`player-${index}-${playerName}`}
                      className="text-sm font-medium leading-none text-white cursor-pointer flex-1"
                    >
                      {playerName}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {selectedPlayers.length > 0 && (
              <div className="mt-2 text-sm text-gray-400">
                {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-400 text-center py-6">
            No player data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}