import {
  createRenderer, createLinear, createCoordinate, cartesian, point, text, drawRedRect,
} from '../src';

test('the public API draws data points and labels in an SVG', () => {
  const renderer = createRenderer(200, 100);
  const scale = createLinear({ domain: [0, 10], range: [0, 1] });
  const coordinate = createCoordinate({
    width: 200, height: 100, transforms: [cartesian()],
  });
  const values = { x: [scale(5)], y: [1 - scale(8)] };
  const [dot] = point(renderer, [0], {}, values, { fill: 'steelblue' }, coordinate);
  const [label] = text(renderer, [0], {}, { ...values, text: ['Sparrow'] }, {}, coordinate);

  expect(dot.getAttribute('cx')).toBe('100');
  expect(Number(dot.getAttribute('cy'))).toBeCloseTo(20);
  expect(dot.getAttribute('fill')).toBe('steelblue');
  expect(label.textContent).toBe('Sparrow');
  expect(renderer.node().contains(label)).toBe(true);
});

test('the original drawRedRect export remains available', () => {
  const svg = createRenderer(100, 100).node();
  drawRedRect(svg);
  expect(svg.querySelector('rect').getAttribute('fill')).toBe('red');
});
