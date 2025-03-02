// src/components/LanguageSelection.tsx
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
  } from './ui/select';
  import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
  } from './ui/card';
  
  interface LanguageSelectionProps {
    onSelectLanguage: (language: string) => void;
  }
  
  export function LanguageSelection({ onSelectLanguage }: LanguageSelectionProps) {
    return (
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <span role="img" aria-label="globe" className="mr-2">🌍</span> Select Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="english" onValueChange={onSelectLanguage}>
            <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="english" className="hover:bg-gray-700">English</SelectItem>
              <SelectItem value="spanish" className="hover:bg-gray-700">Spanish</SelectItem>
              <SelectItem value="japanese" className="hover:bg-gray-700">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }
  