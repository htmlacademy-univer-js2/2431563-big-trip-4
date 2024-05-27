import AbstractView from '../framework/view/abstract-view.js';
import { Filter } from '../constants.js';

const NoPointsTextType = {
  [Filter.EVERYTHING]: 'Click New Event to create your first point',
  [Filter.FUTURE]: 'There are no past events now',
  [Filter.PRESENT]: 'There are no present events now',
  [Filter.PAST]: 'There are no future events now',
};

const createNoPointsTemplate = (filter) => `<p class="trip-events__msg">${NoPointsTextType[filter]}</p>`;

export default class NoPointsView extends AbstractView {
  #filter = null;

  constructor({ filter }) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createNoPointsTemplate(this.#filter);
  }
}

