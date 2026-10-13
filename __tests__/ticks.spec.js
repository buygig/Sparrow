import { ticks } from '../src/scale/utils';

describe('ticks', () => {
  test('returns useful ascending ticks with an optional count.', () => {
    expect(ticks(0.1, 9.9, 6)).toEqual([2, 4, 6, 8]);
    expect(ticks(0, 10)).toEqual([0, 2, 4, 6, 8, 10]);
  });

  test('preserves descending order and returns a singleton for constant domains.', () => {
    expect(ticks(10, 0, 5)).toEqual([10, 8, 6, 4, 2, 0]);
    expect(ticks(7, 7, 5)).toEqual([7]);
  });

  test('returns no ticks for invalid domains or counts.', () => {
    expect(ticks(0, 10, 0)).toEqual([]);
    expect(ticks(0, 10, -1)).toEqual([]);
    expect(ticks(0, 10, NaN)).toEqual([]);
    expect(ticks(0, Infinity, 5)).toEqual([]);
    expect(ticks(NaN, 10, 5)).toEqual([]);
  });

  test('keeps decimal endpoints and very small ticks distinct.', () => {
    expect(ticks(0.1, 0.3, 2)).toEqual([0.1, 0.2, 0.3]);
    expect(ticks(0, 1e-15, 5)).toEqual([0, 2e-16, 4e-16, 6e-16, 8e-16, 1e-15]);
  });
});
