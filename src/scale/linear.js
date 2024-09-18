import {
  floor, normalize, tickStep, nice, ceil, ticks,
} from './utils';

// 线性映射
export function createLinear({
  domain: [d0, d1],
  range: [r0, r1],
  interpolate = interpolateNumber,
}) {
  const scale = (x) => {
    const t = normalize(x, d0, d1);
    return interpolate(t, r0, r1);
  };

  scale.ticks = (tickCount) => ticks(d0, d1, tickCount);
  scale.nice = (tickCount) => {
    const step = tickStep(d0, d1, tickCount);
    [d0, d1] = nice([d0, d1], {
      floor: (x) => floor(x, step),
      ceil: (x) => ceil(x, step),
    });
  };

  return scale;
}

export function interpolateNumber(t, start, stop) {
  return start * (1 - t) + stop * t;
}

export function interpolateColor(t, start, stop) {
  const r = interpolateNumber(t, start[0], stop[0]);
  const g = interpolateNumber(t, start[1], stop[1]);
  const b = interpolateNumber(t, start[2], stop[2]);
  return `rgb(${r}, ${g}, ${b})`;
}
