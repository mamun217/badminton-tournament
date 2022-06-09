/**
 * 0: No team won the match yet
 * 1: Team1 won the match
 * 2: Team2 won the match
 */
export type MatchStatus = 0 | 1 | 2;

/**
 * Determines if the match is won by any team
 * 
 * @param team1GameWinCount Total number of game(s) won by Team1
 * @param team2GameWinCount Total number of game(s) won by Team1
 * @returns MatchStaus
 */
export function determineMatchResult(team1GameWinCount: number, team2GameWinCount: number): MatchStatus {
  if (team1GameWinCount === 2) return 1;
  if (team2GameWinCount === 2) return 2;

  return 0;
}
