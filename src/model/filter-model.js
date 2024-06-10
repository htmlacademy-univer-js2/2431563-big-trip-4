import Observable from '../framework/observable.js';
import { Filter } from '../constants.js';

export default class FilterModel extends Observable {
  #filter = null;

  constructor() {
    super();
    this.#filter = Filter.EVERYTHING;
  }

  get filter() {
    return this.#filter;
  }

  setFilter(update, filter) {
    this.#filter = filter;
    this._notify(update, filter);
  }
}
