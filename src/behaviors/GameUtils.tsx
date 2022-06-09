export const GAME_DEFAULT_SCORE_TO_WIN = 21;
export const SERVER_RECEIVER_BACKGROUND_CSS_CLASS = "server_receiver_background";

/**
 * 1: Team or Player ID 1
 * 2: Team or Player ID 2
 */
export type TeamOrPlayerId = 1 | 2;

export type ServerReceiver = {
  serverTeamId: TeamOrPlayerId;
  receiverTeamId: TeamOrPlayerId;
  serverAndReceiverPlayerId: TeamOrPlayerId;
};

export type WonGameInfo = {
  gameNumber: number;
  teamScore: number;
  opponentScore: number;
  gameTime: string;
};

/**
 * Checks if any team won the game.
 * 
 * @param team1Score Team1 score
 * @param team2Score Team2 score
 * @param noDeuce Pass "true" if deuce to be disabled in the game. Default is false.
 * @param scoreToWin Points required to win a game. Default is 21.
 * @returns 0 if no team wins, 1 if team1 wins or 2 if team2 wins the game.
 */
export function getTeamIdOfGameWinner(team1Score: number, team2Score: number,
  noDeuce = false, scoreToWin = GAME_DEFAULT_SCORE_TO_WIN): 0 | 1 | 2 {

  if ((noDeuce && team1Score === scoreToWin) || team1Score === 30) return 1;
  if ((noDeuce && team2Score === scoreToWin) || team2Score === 30) return 2;
  if (!noDeuce && team1Score >= scoreToWin && (team1Score - team2Score) >= 2) return 1;
  if (!noDeuce && team2Score >= scoreToWin && (team2Score - team1Score) >= 2) return 2;

  return 0;
}

/**
 * Toggles team or player id.
 * 
 * @param argId Either 1 or 2
 * @returns 1 if passed id is 2, 1 otherwise.
 */
export function toggleTeamOrPlayerId(argId: TeamOrPlayerId): TeamOrPlayerId {
  return (argId === 1) ? 2 : 1;
}

/**
 * Determines player id based on given score.
 * 
 * @param {number} score - Team's score
 * @returns Player ID 1 if score is even, 2 otherwise.
 */
export function determineServerAndReceiverPlayerIdByScore(score: number): TeamOrPlayerId {
  return (score % 2 === 0) ? 1 : 2;
};

/**
 * Determines server & receiver team & player for the next serve.
 * 
 * @param idOfTeamEarnedThePoint ID of the team earned current point
 * @param serverCurrentTeamId ID of the team who served 
 * @param serverCurrentPlayerId ID of the player who served
 * @param team1CurrentScore Score of team1 before taking the current point into account
 * @param team2CurrentScore Score of team2 before taking the current point into account
 * @returns ServerReceiver object with determined server & receiver team & player id.
 */
export function determineNextServerAndReceiver(idOfTeamEarnedThePoint: TeamOrPlayerId,
  serverCurrentTeamId: TeamOrPlayerId, serverCurrentPlayerId: TeamOrPlayerId,
  team1CurrentScore: number, team2CurrentScore: number): ServerReceiver {

  let toBeServerTeamId = idOfTeamEarnedThePoint;
  let toBeReceiverTeamId = toggleTeamOrPlayerId(idOfTeamEarnedThePoint);
  let toBePlayerIdServerAndReceiver: TeamOrPlayerId;

  if (serverCurrentTeamId === idOfTeamEarnedThePoint) {
    toBePlayerIdServerAndReceiver = toggleTeamOrPlayerId(serverCurrentPlayerId);
  } else {
    toBePlayerIdServerAndReceiver = determineServerAndReceiverPlayerIdByScore((idOfTeamEarnedThePoint === 1) ? (team1CurrentScore + 1) : (team2CurrentScore + 1));
  }

  return {
    serverTeamId: toBeServerTeamId,
    receiverTeamId: toBeReceiverTeamId,
    serverAndReceiverPlayerId: toBePlayerIdServerAndReceiver,
  };
}
