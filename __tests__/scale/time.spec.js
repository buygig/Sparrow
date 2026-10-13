import { createTime } from '../../src/scale';

describe('createTime', () => {
  test('maps dates and returns Date ticks.', () => {
    const scale = createTime({ domain: [new Date(0), new Date(1000)], range: [0, 10] });
    expect(scale(new Date(500))).toBe(5);
    expect(scale.ticks(5)).toEqual([0, 200, 400, 600, 800, 1000].map((x) => new Date(x)));
  });

  test('nice updates the domain used for mapping and ticks.', () => {
    const scale = createTime({ domain: [new Date(110), new Date(890)], range: [0, 10] });
    scale.nice(4);
    expect(scale(new Date(0))).toBe(0);
    expect(scale(new Date(1000))).toBe(10);
    expect(scale.ticks(4)).toEqual([0, 200, 400, 600, 800, 1000].map((x) => new Date(x)));
  });
});
