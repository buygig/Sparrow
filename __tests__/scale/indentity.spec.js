import { createIdentity } from '../../src/scale';

describe('createIdentity', () => {
  test('createIdentity(options) returns identity function.', () => {
    const identity = createIdentity();
    expect(identity(1)).toBe(1);
    expect(identity('0.5')).toBe('0.5');
    expect(identity(['0.5'])).toEqual(['0.5']);
  });
});
