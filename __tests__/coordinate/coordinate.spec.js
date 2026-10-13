import {
  cartesian, createCoordinate, polar, transpose,
} from '../../src/coordinate';
import {
  translate, scale, reflectX, reflectY, transpose as transposeT, polar as polarT,
} from '../../src/coordinate/transform';

function expectPoint(actual, expected) {
  expect(actual[0]).toBeCloseTo(expected[0]);
  expect(actual[1]).toBeCloseTo(expected[1]);
}

describe('coordinate transforms', () => {
  test.each([
    ['translate', translate(10, 20), [12, 23]],
    ['scale', scale(10, 20), [20, 60]],
    ['reflectX', reflectX(), [-2, 3]],
    ['reflectY', reflectY(), [2, -3]],
    ['transpose', transposeT(), [3, 2]],
  ])('%s transforms a point and exposes its type', (type, transform, expected) => {
    expect(transform([2, 3])).toEqual(expected);
    expect(transform.type()).toBe(type);
  });

  test('polar transforms angle and radius', () => {
    const transform = polarT();
    expectPoint(transform([Math.PI / 2, 2]), [0, 2]);
    expect(transform.type()).toBe('polar');
  });
});

describe('coordinates', () => {
  test('defaults to a unit identity coordinate', () => {
    const coordinate = createCoordinate();
    expect(coordinate([0.2, 0.8])).toEqual([0.2, 0.8]);
    expect(coordinate.center()).toEqual([0.5, 0.5]);
    expect(coordinate.isPolar()).toBe(false);
  });

  test('cartesian maps normalized positions to the canvas', () => {
    const coordinate = createCoordinate({
      x: 10, y: 20, width: 200, height: 100, transforms: [cartesian()],
    });
    expect(coordinate([0, 0])).toEqual([10, 20]);
    expect(coordinate([1, 1])).toEqual([210, 120]);
    expect(coordinate.center()).toEqual([110, 70]);
  });

  test('transpose swaps channels before the canvas mapping', () => {
    const coordinate = createCoordinate({
      width: 200, height: 100, transforms: [transpose(), cartesian()],
    });
    expect(coordinate([0.2, 0.8])).toEqual([160, 20]);
    expect(coordinate.isPolar()).toBe(false);
  });

  test.each([[200, 100], [100, 200]])('polar fits a circular radius inside a %s × %s canvas', (width, height) => {
    const coordinate = createCoordinate({
      x: 10, y: 20, width, height, transforms: [polar(), cartesian()],
    });
    const [cx, cy] = coordinate.center();
    const radius = Math.min(width, height) / 2;
    expectPoint(coordinate([0, 1]), [cx, cy]);
    expectPoint(coordinate([0, 0]), [cx + radius, cy]);
    expectPoint(coordinate([0.25, 0]), [cx, cy + radius]);
    expect(coordinate.isPolar()).toBe(true);
  });

  test('polar respects custom angle and radius ranges', () => {
    const coordinate = createCoordinate({
      width: 100,
      height: 100,
      transforms: [polar({
        innerRadius: 0.5, outerRadius: 1, startAngle: -Math.PI / 2, endAngle: Math.PI / 2,
      }), cartesian()],
    });
    expectPoint(coordinate([0, 1]), [50, 25]);
    expectPoint(coordinate([1, 0]), [50, 100]);
  });
});
