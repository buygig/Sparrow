import { compose } from './utils';

export function createCoordinate({
  x = 0, y = 0, width = 1, height = 1,
  transforms: coordinates = [],
} = {}) {
  const transforms = coordinates
    .map((coordinate) => coordinate({
      x, y, width, height,
    }))
    .flat();

  const output = compose(...transforms);

  const types = transforms.map((d) => d.type());

  output.isPolar = () => types.indexOf('polar') !== -1;

  output.center = () => [x + width / 2, y + height / 2];

  return output;
}
