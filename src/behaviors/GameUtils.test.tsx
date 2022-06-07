import { isGameWon } from "./GameUtils";

test('isGameWon function works as expected', () => {
  expect(isGameWon(10, 5)).toBe(0); // No team wins
  expect(isGameWon(5, 10)).toBe(0); // No team wins
  expect(isGameWon(21, 1)).toBe(1); // Team1 won
  expect(isGameWon(1, 21)).toBe(2); // Team2 won
  expect(isGameWon(21, 19)).toBe(1); // Team1 won
  expect(isGameWon(19, 21)).toBe(2); // Team2 won
  expect(isGameWon(21, 20)).toBe(0); // Deuce, no team wins
  expect(isGameWon(20, 21)).toBe(0); // Deuce, no team wins
  expect(isGameWon(22, 20)).toBe(1); // Deuce, team1 wins
  expect(isGameWon(20, 22)).toBe(2); // Deuce, team2 wins
  expect(isGameWon(30, 29)).toBe(1); // Hard stop, team1 wins
  expect(isGameWon(29, 30)).toBe(2); // Hard stop, team2 wins
  expect(isGameWon(21, 20, true)).toBe(1); // Game doesn't have deuce so team1 wins based on default winning score
  expect(isGameWon(20, 21, true)).toBe(2); // Game doesn't have deuce so team2 wins based on default winning score
  expect(isGameWon(10, 9, true, 10)).toBe(1); // Game doesn't have deuce so team1 wins based on custom winning score of 10
  expect(isGameWon(9, 10, true, 10)).toBe(2); // Game doesn't have deuce so team2 wins based on custom winning score of 10
  expect(isGameWon(11, 9, false, 10)).toBe(1); // Game has deuce so team1 wins based on custom winning score of 10
  expect(isGameWon(9, 11, false, 10)).toBe(2); // Game has deuce so team2 wins based on custom winning score of 10
});
