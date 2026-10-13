import { createThreshold } from './threshold';

export function createQuantile({ domain, range, ...rest }) {
  const n = Math.max(0, range.length - 1);
  const sortedDomain = [...domain].sort((a, b) => a - b);
  if (sortedDomain.length === 0) return () => undefined;

  const step = (sortedDomain.length - 1) / (n + 1);
  const quantileDomain = new Array(n).fill(0).map((_, i) => {
    const index = (i + 1) * step;
    const i0 = Math.floor(index);
    const i1 = Math.min(i0 + 1, sortedDomain.length - 1);
    const v0 = sortedDomain[i0];
    const v1 = sortedDomain[i1];
    return v0 + (v1 - v0) * (index - i0);
  });
  return createThreshold({ domain: quantileDomain, range, ...rest });
}
