import { createChannel, createChannels } from './channel';
import { createGeometry } from './geometry';
import { circle } from './shape';
import { channelStyles } from './style';

function render(renderer, I, scales, channels, directStyles, coordinate) {
  const defaults = {
    r: 3,
    fill: 'none',
  };
  const { x: X, y: Y, r: R = [] } = channels;

  return Array.from(I, (i) => {
    const { r: dr, ...restDefaults } = defaults;
    const r = R[i] ?? directStyles?.r ?? dr;
    return circle(renderer, coordinate, {
      ...restDefaults,
      ...directStyles,
      ...channelStyles(i, channels),
      cx: X[i],
      cy: Y[i],
      r,
    });
  });
}

export const point = createGeometry(createChannels({
  r: createChannel({ name: 'r' }),
}), render);
