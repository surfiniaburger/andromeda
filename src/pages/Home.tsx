// src/pages/Home.tsx
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-950 text-white">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="text-5xl mb-2">💎🏃</div>
        </div>
        
        <h1 className="text-4xl font-bold text-blue-400">Gem Run</h1>
        <p className="text-xl font-medium">MLB Podcast Generator</p>
        
        <p className="text-gray-300">
          Create custom MLB audio updates featuring your favorite teams and players, perfectly tailored to your preferences.
        </p>
        
        <div className="flex flex-col space-y-4 mt-6">
          <Button 
            onClick={() => navigate('/generator')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            Create Your Podcast
          </Button>
        </div>
      </div>
    </div>
  );
}