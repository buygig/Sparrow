import { applyTransform, createSVGElement, mount } from './utils';

export function transform(type, context, ...params) {
  const { group } = context;
  applyTransform(group, `${type}(${params.join(', ')})`);
}

export function translate(context, tx, ty = 0) {
  transform('translate', context, tx, ty);
}

export function rotate(context, theta) {
  transform('rotate', context, theta);
}

export function scale(context, sx, sy = sx) {
  transform('scale', context, sx, sy);
}

export function save(context) {
  const { group } = context;
  const newGroup = createSVGElement('g');
  mount(group, newGroup);
  context.group = newGroup;
}

export function restore(context) {
  const { group } = context;
  const { parentNode } = group;
  if (parentNode !== context.node) context.group = parentNode;
}
