// src/components/TeamSelection.tsx
import { Team } from '../types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Define possible response structures
type TeamResponse = 
  | Team[] 
  | { data: { teams: (Team[] | string[]) }, status: string }
  | { teams: (Team[] | string[]), status?: string };

interface TeamSelectionProps {
  teams: TeamResponse;
  loading: boolean;
  onSelectTeam: (team: string) => void;
}

export function TeamSelection({ teams, loading, onSelectTeam }: TeamSelectionProps) {
// Extract the teams array from the response object
let teamArray: Team[] = [];

if (Array.isArray(teams)) {
  teamArray = teams.map(team => {
    if (typeof team === 'string') {
      // Create a properly typed Team object with all required fields
      return { 
        name: team, 
        id: `team-${team}`, 
        abbreviation: team
      } as Team;
    }
    return team;
  });
} else if (teams && typeof teams === 'object') {
  // Handle nested structure: {data: {teams: []}, status: 'success'}
  if ('data' in teams && teams.data && 'teams' in teams.data) {
    const rawTeams = teams.data.teams;
    if (Array.isArray(rawTeams)) {
      teamArray = rawTeams.map(team => {
        if (typeof team === 'string') {
          // Create a properly typed Team object
          return { 
            name: team, 
            id: `team-${team.replace(/\s+/g, '-').toLowerCase()}`, 
            abbreviation: team.split(' ').map(word => word[0]).join('').toUpperCase() 
          } as Team;
        }
        return team as Team;
      });
    }
  } 
  // Handle direct structure: {teams: []}
  else if ('teams' in teams && Array.isArray(teams.teams)) {
    const rawTeams = teams.teams;
    teamArray = rawTeams.map(team => {
      if (typeof team === 'string') {
        // Create a properly typed Team object
        return { 
          name: team, 
          id: `team-${team.replace(/\s+/g, '-').toLowerCase()}`, 
          abbreviation: team.split(' ').map(word => word[0]).join('').toUpperCase() 
        } as Team;
      }
      return team as Team;
    });
  }
}

  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center">
          <span role="img" aria-label="baseball" className="mr-2">⚾</span> Select Your Team
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <Select onValueChange={onSelectTeam}>
            <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              {teamArray.length > 0 ? (
                teamArray.map((team, index) => (
                  <SelectItem 
                    key={team.id || `team-${index}-${team.name}`} 
                    value={team.name} 
                    className="hover:bg-gray-700"
                  >
                    {team.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-teams" disabled className="text-gray-500">
                  No teams available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
}