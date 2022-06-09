import * as GameUtils from "./GameUtils";

test('isGameWon function works as expected', () => {
  expect(GameUtils.isGameWon(10, 5)).toBe(0); // No team wins
  expect(GameUtils.isGameWon(5, 10)).toBe(0); // No team wins
  expect(GameUtils.isGameWon(21, 1)).toBe(1); // Team1 won
  expect(GameUtils.isGameWon(1, 21)).toBe(2); // Team2 won
  expect(GameUtils.isGameWon(21, 19)).toBe(1); // Team1 won
  expect(GameUtils.isGameWon(19, 21)).toBe(2); // Team2 won
  expect(GameUtils.isGameWon(21, 20)).toBe(0); // Deuce, no team wins
  expect(GameUtils.isGameWon(20, 21)).toBe(0); // Deuce, no team wins
  expect(GameUtils.isGameWon(22, 20)).toBe(1); // Deuce, team1 wins
  expect(GameUtils.isGameWon(20, 22)).toBe(2); // Deuce, team2 wins
  expect(GameUtils.isGameWon(30, 29)).toBe(1); // Hard stop, team1 wins
  expect(GameUtils.isGameWon(29, 30)).toBe(2); // Hard stop, team2 wins
  expect(GameUtils.isGameWon(21, 20, true)).toBe(1); // Game doesn't have deuce so team1 wins based on default winning score
  expect(GameUtils.isGameWon(20, 21, true)).toBe(2); // Game doesn't have deuce so team2 wins based on default winning score
  expect(GameUtils.isGameWon(10, 9, true, 10)).toBe(1); // Game doesn't have deuce so team1 wins based on custom winning score of 10
  expect(GameUtils.isGameWon(9, 10, true, 10)).toBe(2); // Game doesn't have deuce so team2 wins based on custom winning score of 10
  expect(GameUtils.isGameWon(11, 9, false, 10)).toBe(1); // Game has deuce so team1 wins based on custom winning score of 10
  expect(GameUtils.isGameWon(9, 11, false, 10)).toBe(2); // Game has deuce so team2 wins based on custom winning score of 10
});

test('toggleTeamOrPlayerId function works as expected', () => {
  expect(GameUtils.toggleTeamOrPlayerId(1)).toEqual(2);
  expect(GameUtils.toggleTeamOrPlayerId(2)).toEqual(1);
});

test('determineNextServerAndReceiver function works as expected', () => {
  // idOfTeamEarnedThePoint: 1, currentServerTeamId: 1, currentServerPlayerId: 1, team1CurrentScore: 2, team2CurrentScore: 1
  expect(GameUtils.determineNextServerAndReceiver(1, 1, 1, 2, 1)).toEqual({
    serverTeamId: 1,
    receiverTeamId: 2,
    serverAndReceiverPlayerId: 2
  });

  // idOfTeamEarnedThePoint: 1, currentServerTeamId: 1, currentServerPlayerId: 2, team1CurrentScore: 3, team2CurrentScore: 1
  expect(GameUtils.determineNextServerAndReceiver(1, 1, 2, 3, 1)).toEqual({
    serverTeamId: 1,
    receiverTeamId: 2,
    serverAndReceiverPlayerId: 1
  });

  // idOfTeamEarnedThePoint: 1, currentServerTeamId: 2, currentServerPlayerId: 2, team1CurrentScore: 1, team2CurrentScore: 1
  expect(GameUtils.determineNextServerAndReceiver(1, 2, 2, 1, 1)).toEqual({
    serverTeamId: 1,
    receiverTeamId: 2,
    serverAndReceiverPlayerId: 1
  });

  // idOfTeamEarnedThePoint: 1, currentServerTeamId: 2, currentServerPlayerId: 2, team1CurrentScore: 2, team2CurrentScore: 1
  expect(GameUtils.determineNextServerAndReceiver(1, 2, 2, 2, 1)).toEqual({
    serverTeamId: 1,
    receiverTeamId: 2,
    serverAndReceiverPlayerId: 2
  });

  // idOfTeamEarnedThePoint: 2, currentServerTeamId: 2, currentServerPlayerId: 2, team1CurrentScore: 1, team2CurrentScore: 3
  expect(GameUtils.determineNextServerAndReceiver(2, 2, 2, 1, 3)).toEqual({
    serverTeamId: 2,
    receiverTeamId: 1,
    serverAndReceiverPlayerId: 1
  });

  // idOfTeamEarnedThePoint: 2, currentServerTeamId: 1, currentServerPlayerId: 2, team1CurrentScore: 1, team2CurrentScore: 2
  expect(GameUtils.determineNextServerAndReceiver(2, 1, 2, 1, 2)).toEqual({
    serverTeamId: 2,
    receiverTeamId: 1,
    serverAndReceiverPlayerId: 2
  });
});