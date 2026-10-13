export function circle(renderer, coordinate, {
  cx, cy, r, ...styles
}) {
  const [px, py] = coordinate([cx, cy]);
  return renderer.circle({
    cx: px, cy: py, r, ...styles,
  });
}

export function text(renderer, coordinate, {
  x, y, text, rotate = 0, ...styles
}) {
  const [px, py] = coordinate([x, y]);
  renderer.save();
  try {
    renderer.translate(px, py);
    renderer.rotate(rotate);
    return renderer.text({
      text, x: 0, y: 0, ...styles,
    });
  } finally {
    renderer.restore();
  }
}
