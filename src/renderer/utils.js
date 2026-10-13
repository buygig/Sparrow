export function createSVGElement(type) {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

export function mount(parent, child) {
  if (parent) {
    parent.appendChild(child);
  }
}

export function applyAttrubutes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) {
      const kebabCaseKey = key.replace(/[A-Z]/g, (d) => `-${d.toLowerCase()}`);
      element.setAttribute(kebabCaseKey, value);
    }
  }
}

export function applyTransform(element, transform) {
  const oldTransform = element.getAttribute('transform') || '';
  const prefix = oldTransform ? `${oldTransform} ` : '';
  element.setAttribute('transform', `${prefix}${transform}`);
}
