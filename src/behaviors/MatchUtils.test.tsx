import * as MatchUtils from './MatchUtils';

test('getTeamIdOfMatchWinner function works as expected', () => {
  expect(MatchUtils.getTeamIdOfMatchWinner(1, 1)).toEqual(0);
  expect(MatchUtils.getTeamIdOfMatchWinner(2, 1)).toEqual(1);
  expect(MatchUtils.getTeamIdOfMatchWinner(1, 2)).toEqual(2);
});
