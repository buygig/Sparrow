import { createContext } from './context';
import {
  line, circle, text, rect, path, ring,
} from './shape';

export function createRenderer(width, height) {
  const context = createContext(width, height);
  return {
    line: (options) => line(context, options),
    circle: (options) => circle(context, options),
    text: (options) => text(context, options),
    rect: (options) => rect(context, options),
    path: (options) => path(context, options),
    ring: (options) => ring(context, options),
  };
}
