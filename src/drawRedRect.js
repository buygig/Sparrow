export function drawRedRect(svg) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const config = [['x', 0], ['y', 0], ['fill', 'red'], ['width', 100], ['height', 100]];
  config.forEach((el) => {
    rect.setAttribute(el[0], el[1]);
  });
  svg.appendChild(rect);
}
