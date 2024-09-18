export function createGeometry(channels, render) {
  const geometry = (renderer, I, scales, values, styles, coordinate) => {
    for (const [key, { optional, scale }] of Object.entries(channels)) {
      if (!optional) {
        if (!values[key]) throw new Error(`缺少通道：${key}`);
        if (scale === 'band' && (!scales[key] || !scales[key].bandWidth)) {
          throw new Error(`${key} 通道需要Band比例尺`);
        }
      }
    }
    return render(renderer, I, scales, values, styles, coordinate);
  };

  geometry.channels = () => channels;

  return geometry;
}
