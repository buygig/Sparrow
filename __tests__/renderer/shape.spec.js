import { createRenderer } from '../../src/renderer';
import { shape } from '../../src/renderer/shape';
import { createDiv, getAttributes, mount } from '../utils';

describe('shapes', () => {
  test('rect uses the SVG default position when coordinates are omitted', () => {
    const renderer = createRenderer(100, 100);
    const zero = renderer.rect({ width: 0, height: 0 });
    expect(getAttributes(zero, ['x', 'y', 'width', 'height'])).toEqual({
      x: '0', y: '0', width: '0', height: '0',
    });
    const negative = renderer.rect({ width: -10, height: -20 });
    expect(getAttributes(negative, ['x', 'y', 'width', 'height'])).toEqual({
      x: '-10', y: '-20', width: '10', height: '20',
    });
  });

  test('optional attributes are omitted and zero values are retained', () => {
    const renderer = createRenderer(100, 100);
    const circle = renderer.circle({
      cx: 0, cy: 0, r: 0, fill: undefined, stroke: null,
    });
    expect(circle.getAttribute('r')).toBe('0');
    expect(circle.hasAttribute('fill')).toBe(false);
    expect(circle.hasAttribute('stroke')).toBe(false);
  });

  test('path accepts a standard SVG path string', () => {
    const renderer = createRenderer(100, 100);
    const path = renderer.path({ d: 'M 0 0 L 10 10' });
    expect(path.getAttribute('d')).toBe('M 0 0 L 10 10');
  });

  test('ring applies the requested border width to both edges, including zero', () => {
    const renderer = createRenderer(100, 100);
    const [inner, body, outer] = renderer.ring({
      cx: 50, cy: 50, r1: 10, r2: 20, fill: 'red', stroke: 'black', strokeWidth: 2,
    });
    expect(inner.getAttribute('stroke-width')).toBe('2');
    expect(body.getAttribute('stroke-width')).toBe('8');
    expect(outer.getAttribute('stroke-width')).toBe('2');
    const noBorder = renderer.ring({
      cx: 50, cy: 50, r1: 10, r2: 20, strokeWidth: 0,
    });
    expect(noBorder.map((circle) => circle.getAttribute('stroke-width'))).toEqual(['0', '10', '0']);
  });

  test('shape(name, context, attributes) creates SVG elements width specified attributes and mounts it to group.', () => {
    const renderer = createRenderer(600, 400);
    const context = { group: renderer.group() };

    const s = shape('circle', context, {
      cx: 100,
      cy: 100,
      r: 50,
      fill: 'red',
      stroke: 'yellow',
      strokeWidth: 10,
    });

    mount(createDiv(), renderer.node());

    expect(s.tagName).toBe('circle');
    expect(s.parentNode).toBe(renderer.group());
    expect(getAttributes(s, ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width'])).toEqual({
      cx: '100',
      cy: '100',
      r: '50',
      fill: 'red',
      stroke: 'yellow',
      'stroke-width': '10',
    });
  });

  test('circle() creates circle element.', () => {
    const renderer = createRenderer(600, 400);

    const circle = renderer.circle({
      cx: 100,
      cy: 100,
      r: 50,
      fill: 'red',
      stroke: 'yellow',
      strokeWidth: 10,
    });

    mount(createDiv(), renderer.node());
    expect(circle.tagName).toBe('circle');
  });

  test('rect() creates rect element and accepts negative width and height.', () => {
    const renderer = createRenderer(600, 400);

    const rect = renderer.rect({
      x: 100,
      y: 100,
      width: -50,
      height: -50,
    });

    expect(getAttributes(rect, ['x', 'y', 'width', 'height'])).toEqual({
      x: '50',
      y: '50',
      width: '50',
      height: '50',
    });
    mount(createDiv(), renderer.node());
    expect(rect.tagName).toBe('rect');
  });

  test('line() creates line element.', () => {
    const renderer = createRenderer(600, 400);
    const line = renderer.line({
      x1: 0,
      y1: 0,
      x2: 50,
      y2: 50,
      stroke: 'black',
    });
    mount(createDiv(), renderer.node());
    expect(line.tagName).toBe('line');
  });

  test('text() creates text element and sets textContent.', () => {
    const renderer = createRenderer(600, 400);
    const text = renderer.text({
      x: 100,
      y: 100,
      text: 'hello world',
    });
    expect(text.tagName).toBe('text');
    mount(createDiv(), renderer.node());
    expect(text.textContent).toBe('hello world');
  });

  test('path() creates path element and accepts array to specify path.', () => {
    const renderer = createRenderer(600, 400);
    const d = [
      ['M', 10, 10],
      ['L', 100, 100],
      ['L', 100, 10],
      ['Z'],
    ];
    const path = renderer.path({
      d,
      stroke: 'black',
      fill: 'red',
    });
    expect(path.tagName).toBe('path');
    mount(createDiv(), renderer.node());
    expect(path.getAttribute('d')).toBe('M 10 10 L 100 100 L 100 10 Z');
  });
});
