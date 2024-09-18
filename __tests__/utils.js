export function createDiv() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

export function mount(parent, child) {
  if (parent) {
    parent.appendChild(child);
  }
}

export function getAttributes(node, attributes) {
  /** reduce内的回调函数等价于
   * (total, cur) => {
   *  total[cur] = node.getAttribute(cur);
   *  return total;
   * }
   */
  return attributes.reduce((total, cur) => (total[cur] = node.getAttribute(cur), total), {});
}
