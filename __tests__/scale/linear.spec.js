import { createLinear } from '../../src/scale';

describe('createLinear', () => {
  test('createLinear(options) returns linear function.', () => {
    const linear = createLinear({ domain: [0, 1], range: [0, 10] });
    expect(linear(0.2)).toBe(2);
    expect(linear(0.5)).toBe(5);
  });
});
