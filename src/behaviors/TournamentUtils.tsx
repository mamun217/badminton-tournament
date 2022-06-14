export type Team = {
  name: string,
  player1?: string,
  player2?: string,
};

export type Match = {
  teams: Team[],
  winner?: 0 | 1,
};

export type TeamStanding = {
  team: Team,
  matchPlayed: number,
  matchPoint: number,
  setPlayed: number,
  earnedScore: number,
  lostScore: number,
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