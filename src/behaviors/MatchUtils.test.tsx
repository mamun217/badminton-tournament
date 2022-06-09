import * as MatchUtils from './MatchUtils';

test('determineMatchResult function works as expected', () => {
  expect(MatchUtils.determineMatchResult(1, 1)).toEqual(0);
  expect(MatchUtils.determineMatchResult(2, 1)).toEqual(1);
  expect(MatchUtils.determineMatchResult(1, 2)).toEqual(2);
});
