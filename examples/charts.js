/* global sp */
if (typeof sp === 'undefined') {
  document.querySelector('#error').hidden = false;
} else {
  const {
    createRenderer, createLinear, createBand, createCoordinate, cartesian, polar, point,
  } = sp;
  const ink = '#52667a';
  const blue = '#3478c0';
  const data = [32, 58, 45, 82, 67];
  const names = ['A', 'B', 'C', 'D', 'E'];
  const indices = data.map((_, i) => i);
  const unit = createLinear({ domain: [0, 100], range: [0, 1] });

  const mount = (id, renderer, label) => {
    const svg = renderer.node();
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', label);
    document.querySelector(id).appendChild(svg);
  };

  const axes = (renderer) => {
    const y = createLinear({ domain: [0, 100], range: [240, 20] });
    y.ticks(5).forEach((tick) => {
      renderer.line({
        x1: 40, y1: y(tick), x2: 410, y2: y(tick), stroke: '#e3eaf2',
      });
      renderer.text({
        x: 30, y: y(tick) + 4, text: tick, fill: ink, textAnchor: 'end', fontSize: 12,
      });
    });
    renderer.line({
      x1: 40, y1: 240, x2: 410, y2: 240, stroke: ink,
    });
  };

  const bars = createRenderer(440, 280);
  axes(bars);
  const band = createBand({ domain: names, range: [40, 410], padding: 0.2 });
  data.forEach((value, i) => {
    const rect = bars.rect({
      x: band(names[i]), y: 240, width: band.bandWidth(), height: -unit(value) * 220, fill: blue,
    });
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${names[i]}: ${value}`;
    rect.appendChild(title);
    bars.text({
      x: band(names[i]) + band.bandWidth() / 2, y: 260, text: names[i], textAnchor: 'middle', fill: ink, fontSize: 13,
    });
  });
  mount('#bars', bars, '柱状图：A 32，B 58，C 45，D 82，E 67');

  const scatter = createRenderer(440, 280);
  axes(scatter);
  const coordinate = createCoordinate({
    x: 40, y: 20, width: 370, height: 220, transforms: [cartesian()],
  });
  point(scatter, indices, {}, {
    x: indices.map((i) => (i + 1) / 6), y: data.map((value) => 1 - unit(value)),
  }, { fill: blue, r: 6 }, coordinate);
  mount('#scatter', scatter, '散点图：五个依序排列的点，y 值为 32、58、45、82、67');

  const radial = createRenderer(440, 280);
  [40, 80, 110].forEach((r) => radial.circle({
    cx: 220, cy: 140, r, fill: 'none', stroke: '#e3eaf2',
  }));
  const radialCoordinate = createCoordinate({
    x: 110, y: 30, width: 220, height: 220, transforms: [polar(), cartesian()],
  });
  point(radial, indices, {}, {
    x: indices.map((i) => i / data.length), y: data.map((value) => 1 - unit(value)),
  }, { fill: '#248673', r: 6 }, radialCoordinate);
  mount('#polar', radial, '极坐标点图：五个角度，半径表示 32、58、45、82、67');
}
