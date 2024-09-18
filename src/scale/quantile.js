import { createThreshold } from './threshold';

export function createQuantile({ domain, range, ...rest }) {
  const n = range.length - 1;
  const sortedDomain = domain.sort((a, b) => a - b);
  const step = (sortedDomain.length - 1) / (n + 1);
  const quantileDomain = new Array(n).fill(0).map((_, i) => {
    const index = (i + 1) * step;
    const index0 = Math.floor(index);
    const index1 = index0 + 1;
    const value0 = sortedDomain[index0];
    const value1 = sortedDomain[index1];
    return value0 * (index1 - index) + value1 * (index - index0);
  });
  return createThreshold({ domain: quantileDomain, range, ...rest });
}
