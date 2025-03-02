// New component: src/components/DebugConsole.tsx
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface DebugConsoleProps {
  debugInfo: {
    endpoint: string;
    status: number;
    data: unknown;
    timestamp: string;
  }[];
}

export function DebugConsole({ debugInfo }: DebugConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (debugInfo.length === 0 && !isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="p-2 bg-gray-950 flex justify-between items-center border-t border-gray-800">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant="outline" 
          className="text-xs bg-gray-800 hover:bg-gray-700 text-white"
        >
          {isOpen ? 'Hide Debug Console' : 'Show Debug Console'} ({debugInfo.length})
        </Button>
        {debugInfo.length > 0 && (
          <div className="text-xs text-gray-400">
            Last: {debugInfo[debugInfo.length - 1].endpoint.split('/').pop()} 
            {debugInfo[debugInfo.length - 1].status === 0 ? ' (Failed)' : ` (${debugInfo[debugInfo.length - 1].status})`}
          </div>
        )}
      </div>
      
      {isOpen && (
        <Card className="rounded-none border-t-0 bg-gray-900 text-white max-h-96">
          <CardHeader className="p-2 border-b border-gray-800">
            <CardTitle className="text-sm font-medium">API Response Debug Console</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {debugInfo.map((item, index) => (
                <div key={index} className="p-2 border-b border-gray-800">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <div className="font-mono">{item.endpoint}</div>
                    <div className={item.status >= 200 && item.status < 300 ? "text-green-400" : "text-red-400"}>
                      {item.status || 'ERROR'}
                    </div>
                  </div>
                  <div className="text-xs font-mono bg-gray-950 p-2 rounded overflow-auto max-h-40">
                    <pre>{JSON.stringify(item.data, null, 2)}</pre>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
