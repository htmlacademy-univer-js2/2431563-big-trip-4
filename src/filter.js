import { Filter } from './constants.js';
import { isPointInTheFuture, isPointInThePast, isPointInThePresent } from './utils.js';

const filter = {
  [Filter.EVERYTHING]: (points) => points,
  [Filter.FUTURE]: (points) => points.filter((point) => isPointInTheFuture(point)),
  [Filter.PRESENT]: (points) => points.filter((point) => isPointInThePresent(point)),
  [Filter.PAST]: (points) => points.filter((point) => isPointInThePast(point))
};

export { filter };
