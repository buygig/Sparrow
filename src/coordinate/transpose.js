import {
  translate, scale, reflectY, polar as polerT,
} from './transform';

import { curry } from './utils';

function coordinate(transformOptions, canvasOptions) {
  const { width, height } = canvasOptions;
  const {
    innerRadius, outerRadius, startAngle, endAngle,
  } = transformOptions;

  const aspect = width / height;
  const sx = aspect > 1 ? 1 / aspect : 1;
  const sy = aspect > 1 ? 1 : aspect;

  return [
    // 以画布中心沿Y方向翻转
    translate(0, -0.5),
    reflectY(),
    translate(0, 0.5),

    // 调整角度和半径的范围
    scale(endAngle - startAngle, outerRadius - innerRadius),
    translate(startAngle, innerRadius),
    polerT(),

    // 改变大小内切画布
    scale(sx, sy),
    scale(0.5, 0.5),

    // 移动到画布中心
    translate(0.5, 0.5),
  ];
}

export const transpose = curry(coordinate);
