import { FilterType } from './const.js';
import { isPointInTheFuture, isPointInThePast, isPointInThePresent } from './utils.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointInTheFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointInThePresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointInThePast(point))
};

export { filter };
