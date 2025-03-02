// src/components/AudioPlayer.tsx
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
  } from './ui/card';
  import { Slider } from './ui/slider';
  import { Button } from './ui/button';
  import { useState, useRef} from 'react';
  
  interface AudioPlayerProps {
    audioUrl: string;
    title: string;
  }
  
  export function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
  
    const togglePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
  
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };
  
    const handleSliderChange = (value: number[]) => {
      if (audioRef.current) {
        audioRef.current.currentTime = value[0];
        setCurrentTime(value[0]);
      }
    };
  
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <span role="img" aria-label="headphones" className="mr-2">🎧</span> Your Podcast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">{title}</h3>
            
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="space-y-2">
              <Slider 
                value={[currentTime]} 
                max={duration || 100}
                step={1}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={togglePlayPause}
                className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? (
                  <span className="text-xl">⏸️</span>
                ) : (
                  <span className="text-xl">▶️</span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }