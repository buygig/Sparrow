export function normalize(value, start, stop) {
  const difference = value - start;
  if (Number.isNaN(difference)) return NaN;
  if (start === stop) return 0.5;
  return difference / (stop - start);
}

export function tickStep(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)
    || !Number.isFinite(count) || count <= 0 || min === max) return 0;

  const e10 = Math.sqrt(50);
  const e5 = Math.sqrt(10);
  const e2 = Math.sqrt(2);

  const step0 = Math.abs(max - min) / Math.max(0, count);
  let step1 = 10 ** Math.floor(Math.log(step0) / Math.LN10);
  const error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;

  return step1;
}

export function ticks(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)
    || !Number.isFinite(count) || count <= 0) return [];
  if (min === max) return [min];

  const reverse = max < min;
  if (reverse) [min, max] = [max, min];
  const step = tickStep(min, max, count);
  if (!Number.isFinite(step) || step <= 0) return [];

  const reciprocal = step < 1 && Number.isFinite(1 / step) ? 1 / step : 0;
  const start = Math.ceil(reciprocal ? min * reciprocal : min / step);
  const stop = Math.floor(reciprocal ? max * reciprocal : max / step);

  const n = Math.max(0, Math.ceil(stop - start + 1));

  const values = new Array(n);
  for (let i = 0; i < n; i += 1) {
    values[i] = round(reciprocal ? (start + i) / reciprocal : (start + i) * step);
  }
  return reverse ? values.reverse() : values;
}

export function round(n) {
  return Number(n.toPrecision(15));
}

export function nice(domain, interval) {
  const [start, stop] = domain;
  return start > stop
    ? [interval.ceil(start), interval.floor(stop)]
    : [interval.floor(start), interval.ceil(stop)];
}

export function ceil(n, base) {
  const reciprocal = base < 1 && Number.isFinite(1 / base) ? 1 / base : 0;
  return round(reciprocal ? Math.ceil(n * reciprocal) / reciprocal : base * Math.ceil(n / base));
}

export function floor(n, base) {
  const reciprocal = base < 1 && Number.isFinite(1 / base) ? 1 / base : 0;
  return round(reciprocal ? Math.floor(n * reciprocal) / reciprocal : base * Math.floor(n / base));
}

export function equal(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function band({ domain, range, padding = 0 }) {
  const [r0, r1] = range;
  const n = domain.length;
  const reverse = r1 < r0;
  const start = Math.min(r0, r1);
  const stop = Math.max(r0, r1);
  padding = Math.max(0, Math.min(1, padding));
  const step = n === 0 ? 0 : (stop - start) / (n + padding);
  const bandWidth = step * (1 - padding);
  const interval = step - bandWidth;
  const x = (_, i) => start + interval + step * i;
  const bandRange = new Array(n).fill(0).map(x);
  return {
    step,
    bandWidth,
    bandRange: reverse ? bandRange.reverse() : bandRange,
  };
}

export function log(x, base) {
  return Math.log(x) / Math.log(base);
}
