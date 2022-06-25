import { firstLetterUpperCase } from './StringUtils';

test('firstLetterUpperCase function works as expected', () => {
  expect(firstLetterUpperCase('')).toEqual('');
  expect(firstLetterUpperCase('  ')).toEqual('  ');
  expect(firstLetterUpperCase('t')).toEqual('T');
  expect(firstLetterUpperCase('test')).toEqual('Test');
  expect(firstLetterUpperCase('Test')).toEqual('Test');
  expect(firstLetterUpperCase('1234')).toEqual('1234');
});
