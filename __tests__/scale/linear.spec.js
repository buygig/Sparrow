import { createLinear, interpolateColor } from '../../src/scale';

describe('createLinear', () => {
  test('createLinear(options) returns linear function.', () => {
    const linear = createLinear({ domain: [0, 1], range: [0, 10] });
    expect(linear(0.2)).toBe(2);
    expect(linear(0.5)).toBe(5);
  });

  test('constant domains map to the center of the range and have one tick.', () => {
    const linear = createLinear({ domain: [7, 7], range: [0, 10] });
    expect(linear(7)).toBe(5);
    expect(linear(NaN)).toBeNaN();
    expect(linear.ticks()).toEqual([7]);
    linear.nice();
    expect(linear(7)).toBe(5);
  });

  test('ticks and nice preserve descending domain order.', () => {
    const linear = createLinear({ domain: [9.9, 0.1], range: [0, 1] });
    expect(linear.ticks(6)).toEqual([8, 6, 4, 2]);
    linear.nice(6);
    expect(linear(10)).toBe(0);
    expect(linear(0)).toBe(1);
    expect(linear.ticks(6)).toEqual([10, 8, 6, 4, 2, 0]);
  });

  test('nice uses a default tick count and ignores unusable counts.', () => {
    const linear = createLinear({ domain: [0.1, 9.9], range: [0, 1] });
    linear.nice(0);
    expect(linear(0.1)).toBe(0);
    linear.nice();
    expect(linear(0)).toBe(0);
    expect(linear(10)).toBe(1);
  });

  test('supports the public color interpolator.', () => {
    const scale = createLinear({
      domain: [0, 1],
      range: [[0, 20, 40], [100, 120, 140]],
      interpolate: interpolateColor,
    });
    expect(scale(0.5)).toBe('rgb(50, 70, 90)');
  });
});
