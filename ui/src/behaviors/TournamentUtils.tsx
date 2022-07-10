const MATCH_TYPE_GROUP = "Group";
const MATCH_TYPE_POOL = "Pool";

export type Team = {
  name: string;
  player1?: string; //TODO: Change to mandatory later
  player2?: string; //TODO: Change to mandatory later
};

export type Group = {
  groupName: string;
  teams: Team[];
};

export type Match = {
  matchId?: string; //TODO: Change to mandatory later
  teams: Team[];
  winner?: 0 | 1;
};

export type TeamStanding = {
  team: Team;
  matchPlayed: number;
  matchPoint: number;
  setPlayed: number;
  earnedScore: number;
  lostScore: number;
};

export type GroupStanding = {
  [key: string]: TeamStanding[];
};

export type PoolStanding = {
  [key: string]: GroupStanding;
};

export type GroupMatches = {
  [key: string]: Match[];
};

export type PoolMatches = {
  [key: string]: GroupMatches;
};

export type TournamentConfig = {
  tournamentName?: string;
  numberOfTeam?: number;
  numberOfGroup?: number;
  numberOfPool?: number;
  groupScoreToWin?: number;
  groupNoDeuce?: boolean;
  poolScoreToWin?: number;
  poolNoDeuce?: boolean;
  groups?: Group[];
  groupMatches?: GroupMatches;
  groupStanding?: GroupStanding;
  poolMatches?: PoolMatches;
  poolStanding?: PoolStanding;
  semifinalMatches?: Match[];
  finalMatches?: Match[];
};

export const getAPD = (
  earnedScore: number,
  lostScore: number,
  setPlayed: number
) => {
  if (setPlayed <= 0) {
    return 0;
  }
  return ((earnedScore - lostScore) / setPlayed).toFixed(2);
};

export const createInitialGroups = (
  numberOfTeam: number,
  numberOfGroup: number
): Group[] => {
  const initialGroups: Group[] = new Array(numberOfGroup);
  const teamsInAGroup = numberOfTeam / numberOfGroup;
  const teams: Team[] = new Array(teamsInAGroup);
  for (let i = 0; i < teamsInAGroup; i++) {
    teams[i] = {
      name: "",
      player1: "",
      player2: "",
    };
  }

  for (let i = 1; i <= numberOfGroup; i++) {
    initialGroups[i - 1] = {
      groupName: `${MATCH_TYPE_GROUP} ${i}`,
      teams: teams.map((team) => ({ ...team })),
    } as Group;
  }
  return initialGroups;
};

export const createMatches = (groupId: string, teams: Team[]): Match[] => {
  if (!teams || teams.length < 2) {
    return [];
  }

  let totalMatches = (teams.length * (teams.length - 1)) / 2;
  const matches: Match[] = new Array(totalMatches);
  for (let i = 0; i < teams.length - 1; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches[--totalMatches] = {
        matchId: `${groupId}-${totalMatches}`,
        teams: [teams[i], teams[j]],
      } as Match;
    }
  }

  return matches;
};
