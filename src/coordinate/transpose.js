import { transpose as transposeT } from './transform';
import { curry } from './utils';

// Both parameters preserve the shared curried coordinate API.
// eslint-disable-next-line no-unused-vars
function coordinate(transformOptions, canvasOptions) {
  return [transposeT()];
}

export const transpose = curry(coordinate);
