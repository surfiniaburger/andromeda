import { useEffect } from 'react';
import { Game } from '../types';

interface LastGameHandlerProps {
  lastGame: Game | null;
  loading: boolean;
  onSelectGame: (opponent: string) => void;
}

export function LastGameHandler({ lastGame, loading, onSelectGame }: LastGameHandlerProps) {
  // Automatically select the last game when the component mounts or lastGame changes
  useEffect(() => {
    if (lastGame && !loading) {
      onSelectGame(lastGame.opponent);
    }
  }, [lastGame, loading, onSelectGame]);
  
  // This component doesn't render anything visible - it just handles the logic
  return null;
}