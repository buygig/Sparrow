export function createThreshold({ domain, range }) {
  const n = Math.max(0, Math.min(domain.length, range.length - 1));
  const thresholds = domain.slice(0, n);
  return (x) => {
    if (x === undefined || Number.isNaN(x)) return undefined;
    const index = thresholds.findIndex((v) => x < v);
    return range[index === -1 ? n : index];
  };
}
