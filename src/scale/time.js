import { createLiner } from './linear';

export function createTime({ domain, ...rest }) {
  const transform = (x) => x.getTime();
  const transformedDomain = domain.map(transform);
  const liner = createLiner({ domain: transformedDomain, ...rest });
  const scale = (x) => liner(transform(x));

  scale.nice = (tickCount) => liner.nice(tickCount);
  scale.ticks = (tickCount) => liner.ticks(tickCount).map((d) => new Date(d));

  return scale;
}
