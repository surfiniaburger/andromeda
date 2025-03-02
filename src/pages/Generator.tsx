// src/pages/Generator.tsx - add support for easier error debugging
import { PodcastForm } from '../components/PodcastForm';
import { useState } from 'react';
import { Button } from '../components/ui/button';

export function Generator() {
  const [testModeActive, setTestModeActive] = useState(false);

  const handleTestMode = () => {
    setTestModeActive(!testModeActive);
    if (!testModeActive) {
      // Mock API calls in dev tools console
      console.log("🧪 Test APIs:");
      console.log("GET /api/v1/teams");
      console.log("GET /api/v1/teams/{team_name}/players");
      console.log("GET /api/v1/teams/{team_name}/games/last");
      console.log("GET /api/v1/teams/{team_name}/games/history?count=5");
      console.log("POST /api/v1/podcast");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-blue-400 flex items-center">
            <span className="mr-2">💎🏃</span> Gem Run
          </h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleTestMode}
            className="ml-2 text-xs text-gray-500 hover:text-gray-300"
          >
            🧪
          </Button>
        </div>
        <p className="text-gray-300 mt-1">MLB Podcast Generator</p>
        
        {testModeActive && (
          <div className="mt-2 bg-gray-800 text-xs p-2 rounded text-left max-w-md mx-auto">
            <p className="font-mono text-gray-300">API Base: https://mlb-strings-1011675918473.us-central1.run.app</p>
            <p className="font-mono text-gray-300">Debugging active. Check console for details.</p>
          </div>
        )}
      </div>
      
      <PodcastForm />
    </div>
  );
}