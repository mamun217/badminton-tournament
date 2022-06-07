const GAME_DEFAULT_SCORE_TO_WIN = 21;

/**
 * Checks if any team won the game.
 * 
 * @param team1Score Team1 score
 * @param team2Score Team2 score
 * @param noDeuce Pass "true" if deuce to be disabled in the game. Default is false.
 * @param scoreToWin Points required to win a game. Default is 21.
 * @returns 0 if no team wins, 1 if team1 wins or 2 if team2 wins the game.
 */
export function isGameWon(team1Score: number, team2Score: number,
  noDeuce = false, scoreToWin = GAME_DEFAULT_SCORE_TO_WIN): 0 | 1 | 2 {

  if ((noDeuce && team1Score === scoreToWin) || team1Score === 30) return 1;
  if ((noDeuce && team2Score === scoreToWin) || team2Score === 30) return 2;
  if (!noDeuce && team1Score >= scoreToWin && (team1Score - team2Score) >= 2) return 1;
  if (!noDeuce && team2Score >= scoreToWin && (team2Score - team1Score) >= 2) return 2;

  return 0;
}
