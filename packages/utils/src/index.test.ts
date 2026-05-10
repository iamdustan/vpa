import { expect, test } from 'vitest';
import { hello } from './index';

test('hello returns world', () => {
  expect(hello()).toBe('world');
});
