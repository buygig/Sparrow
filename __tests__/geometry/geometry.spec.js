import { point, text } from '../../src/geometry';
import { text as shapeText } from '../../src/geometry/shape';
import { createRenderer } from '../../src/renderer';
import { cartesian, createCoordinate } from '../../src/coordinate';

function createCanvas() {
  return createCoordinate({ width: 200, height: 100, transforms: [cartesian()] });
}

describe('point geometry', () => {
  test('maps indexed points, style channels and zero radii', () => {
    const renderer = createRenderer(200, 100);
    const nodes = point(renderer, [1, 0], {}, {
      x: [0.2, 0.8], y: [0.3, 0.7], r: [0, 8], fill: ['red', 'blue'],
    }, { stroke: 'black' }, createCanvas());

    expect(nodes).toHaveLength(2);
    expect(nodes[0].getAttribute('cx')).toBe('160');
    expect(nodes[0].getAttribute('cy')).toBe('70');
    expect(nodes[0].getAttribute('r')).toBe('8');
    expect(nodes[0].getAttribute('fill')).toBe('blue');
    expect(nodes[0].getAttribute('stroke')).toBe('black');
    expect(nodes[1].getAttribute('r')).toBe('0');
  });

  test('respects direct radius styles and supplies defaults', () => {
    const renderer = createRenderer(200, 100);
    const values = { x: [0], y: [0] };
    const [styled] = point(renderer, [0], {}, values, { r: 6 }, createCanvas());
    const [fallback] = point(renderer, [0], {}, values, {}, createCanvas());
    expect(styled.getAttribute('r')).toBe('6');
    expect(fallback.getAttribute('r')).toBe('3');
    expect(fallback.getAttribute('fill')).toBe('none');
  });

  test('validates required channels before rendering', () => {
    const renderer = createRenderer(200, 100);
    expect(() => point(renderer, [0], {}, { x: [0] }, {}, createCanvas()))
      .toThrow('缺少通道：y');
    expect(renderer.group().childNodes).toHaveLength(0);
    expect(point.channels().r.name).toBe('r');
  });
});

describe('text geometry', () => {
  test('uses coordinate positions and preserves the renderer group', () => {
    const renderer = createRenderer(200, 100);
    const group = renderer.group();
    const [node] = text(renderer, [0], {}, {
      x: [0.5], y: [0.25], text: ['Hello'], fill: ['red'],
    }, { fontSize: 18, rotate: 30 }, createCanvas());

    expect(node.textContent).toBe('Hello');
    expect(node.getAttribute('font-size')).toBe('18');
    expect(node.getAttribute('fill')).toBe('red');
    expect(node.parentNode.getAttribute('transform')).toBe('translate(100, 25) rotate(30)');
    expect(renderer.group()).toBe(group);
  });

  test('channel values override direct styles, including zero', () => {
    const renderer = createRenderer(200, 100);
    const [node] = text(renderer, [0], {}, {
      x: [0], y: [0], text: [0], fontSize: [0], rotate: [0],
    }, { fontSize: 18, rotate: 30 }, createCanvas());
    expect(node.textContent).toBe('0');
    expect(node.getAttribute('font-size')).toBe('0');
    expect(node.parentNode.getAttribute('transform')).toBe('translate(0, 0) rotate(0)');
  });

  test('requires the text channel', () => {
    const renderer = createRenderer(200, 100);
    expect(() => text(renderer, [0], {}, { x: [0], y: [0] }, {}, createCanvas()))
      .toThrow('缺少通道：text');
  });

  test('restores renderer state when text rendering throws', () => {
    const renderer = createRenderer(200, 100);
    const group = renderer.group();
    renderer.text = () => { throw new Error('Cannot render text'); };
    expect(() => shapeText(renderer, createCanvas(), { x: 0, y: 0, text: 'Hello' }))
      .toThrow('Cannot render text');
    expect(renderer.group()).toBe(group);
  });
});
