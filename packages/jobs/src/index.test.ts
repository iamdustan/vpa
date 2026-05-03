import { expect, test } from 'vitest';

test('jobs provider list is populated', async () => {
  const { PROVIDERS } = await import('./index');
  expect(Object.keys(PROVIDERS).length).toBeGreaterThan(0);
});
