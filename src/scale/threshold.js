export function createThreshold({ domain, range }) {
  const n = Math.min(domain.length, range.length - 1);
  return (x) => {
    const index = domain.findIndex((d) => x < d);
    return range[index === -1 ? n : index];
  };
}
