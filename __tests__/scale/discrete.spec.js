import {
  createOrdinal, createBand, createPoint, createQuantize, createQuantile, createThreshold,
} from '../../src/scale';

describe('discrete scales', () => {
  test('ordinal scales repeat ranges and leave unknown categories unmapped.', () => {
    const scale = createOrdinal({ domain: ['a', 'b', 'c'], range: ['red', 'blue'] });
    expect(['a', 'b', 'c'].map(scale)).toEqual(['red', 'blue', 'red']);
    expect(scale('missing')).toBeUndefined();
  });

  test('band scales work without padding and with reversed ranges.', () => {
    const scale = createBand({ domain: ['a', 'b'], range: [0, 100] });
    expect(['a', 'b'].map(scale)).toEqual([0, 50]);
    expect(scale.bandWidth()).toBe(50);
    expect(scale.step()).toBe(50);

    const reversed = createBand({ domain: ['a', 'b'], range: [100, 0] });
    expect(['a', 'b'].map(reversed)).toEqual([50, 0]);
    expect(reversed.bandWidth()).toBe(50);
    expect(reversed.step()).toBe(50);
  });

  test('band padding leaves equal inner and outer gaps.', () => {
    const scale = createBand({ domain: ['a', 'b'], range: [0, 100], padding: 0.5 });
    expect(['a', 'b'].map(scale)).toEqual([20, 60]);
    expect(scale.bandWidth()).toBe(20);
    expect(scale.step()).toBe(40);
  });

  test('point scales have zero width and center a single category.', () => {
    const scale = createPoint({ domain: ['a'], range: [0, 100] });
    expect(scale('a')).toBe(50);
    expect(scale.bandWidth()).toBe(0);
  });

  test('empty band domains have finite zero dimensions.', () => {
    const scale = createBand({ domain: [], range: [0, 100] });
    expect(scale('missing')).toBeUndefined();
    expect(scale.bandWidth()).toBe(0);
    expect(scale.step()).toBe(0);
  });

  test('quantize thresholds include a nonzero domain origin.', () => {
    const scale = createQuantize({ domain: [10, 40], range: ['low', 'mid', 'high'] });
    expect([0, 10, 19.9, 20, 29.9, 30, 40, 50].map(scale))
      .toEqual(['low', 'low', 'low', 'mid', 'mid', 'high', 'high', 'high']);
    expect(createQuantize({ domain: [10, 40], range: [] })(20)).toBeUndefined();
  });

  test('quantile thresholds interpolate sorted samples without changing the input.', () => {
    const domain = [100, 0, 50, 1, 30, 10, 20, 11];
    const scale = createQuantile({ domain, range: ['a', 'b', 'c', 'd'] });
    expect([0, 7.75, 15.5, 35, 100].map(scale)).toEqual(['a', 'b', 'c', 'd', 'd']);
    expect(domain).toEqual([100, 0, 50, 1, 30, 10, 20, 11]);
  });

  test('quantile scales handle empty and single-sample domains.', () => {
    expect(createQuantile({ domain: [], range: ['a', 'b'] })(0)).toBeUndefined();
    expect(createQuantile({ domain: [7], range: ['a', 'b'] })(7)).toBe('b');
    expect(createQuantile({ domain: [1, 2], range: [] })(1)).toBeUndefined();
    expect(createQuantile({ domain: [1, 2], range: ['a'] })(1)).toBe('a');
  });

  test('thresholds use upper bins at boundaries and ignore unreachable thresholds.', () => {
    const scale = createThreshold({ domain: [10, 20, 30], range: ['low', 'high'] });
    expect([0, 10, 25, 40].map(scale)).toEqual(['low', 'high', 'high', 'high']);
    expect(scale(NaN)).toBeUndefined();
    expect(scale(undefined)).toBeUndefined();
  });
});
