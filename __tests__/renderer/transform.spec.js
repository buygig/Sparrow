import { createRenderer } from '../../src/renderer';
import { createDiv, mount } from '../utils';

describe('transform', () => {
  test('restore cannot escape the root group', () => {
    const renderer = createRenderer(100, 100);
    const root = renderer.group();
    renderer.restore();
    renderer.restore();
    expect(renderer.group()).toBe(root);
    renderer.save();
    renderer.save();
    renderer.restore();
    renderer.restore();
    renderer.restore();
    expect(renderer.group()).toBe(root);
    expect(renderer.circle({ cx: 0, cy: 0, r: 1 }).parentNode).toBe(root);
  });

  test('one-argument translate and scale use SVG defaults', () => {
    const renderer = createRenderer(100, 100);
    renderer.translate(10);
    renderer.scale(2);
    expect(renderer.group().getAttribute('transform')).toBe('translate(10, 0) scale(2, 2)');
  });

  test('Renderer should apply specified transforms and can save or restore transforms context.', () => {
    const renderer = createRenderer(600, 400);

    renderer.save();
    renderer.translate(200, 100);
    renderer.rotate(60);
    renderer.scale(2, 3);
    const r1 = renderer.rect({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    });
    renderer.restore();

    const r2 = renderer.rect({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    });

    mount(createDiv(), renderer.node());

    expect(r1.parentNode.getAttribute('transform')).toBe('translate(200, 100) rotate(60) scale(2, 3)');
    expect(r2.parentNode.getAttribute('transform')).toBeNull();
  });
});
