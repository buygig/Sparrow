function transform(type, transformer) {
  transformer.type = () => type;
  return transform;
}

export function translate(tx = 0, ty = 0) {
  return transform('translate', ([px, py]) => [px + tx, py + ty]);
}

export function scale(sx = 1, sy = 1) {
  return transform('scale', ([px, py]) => [px * sx, py * sy]);
}

export function reflectX() {
  return transform('reflectX', scale(-1, 1));
}

export function reflectY() {
  return transform('reflectY', scale(1, -1));
}

export function transpose() {
  return transform('transpose', ([px, py]) => [py, px]);
}

export function polar() {
  return transform('polar', ([theta, radius]) => {
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    return [x, y];
  });
}
