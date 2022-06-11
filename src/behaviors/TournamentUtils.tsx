export type Team = {
  name: string,
  player1: string,
  player2: string,
};

export type Match = {
  teams: Team[],
  winner: 0 | 1,
}
