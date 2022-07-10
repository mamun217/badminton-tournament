/**
 * Determines if the match is won by any team
 *
 * @param team1GameWinCount Total number of game(s) won by Team1
 * @param team2GameWinCount Total number of game(s) won by Team1
 * @returns ID of the team won this match or -1 if no team wins.
 */
export function getTeamIdOfMatchWinner(
  team1GameWinCount: number,
  team2GameWinCount: number
): -1 | 0 | 1 {
  if (team1GameWinCount === 2) return 0;
  if (team2GameWinCount === 2) return 1;

  return -1;
}
