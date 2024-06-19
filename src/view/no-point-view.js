import AbstractView from '../framework/view/abstract-view.js';
import { Filter, NoPointsText } from '../constants';

const filterText = {
  [Filter.EVERYTHING]: 'Click New Event to create your first point',
  [Filter.FUTURE]: 'There are no future events now',
  [Filter.PRESENT]: 'There are no present events now',
  [Filter.PAST]: 'There are no past events now',
};

function createNoPointViewTemplate(isLoading, filterType) {
  const noPointsText = filterText[filterType];
  const noPointTextValue = isLoading ? NoPointsText.LOADING : noPointsText;
  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
}

export default class NoPointView extends AbstractView {
  #filterType = null;
  #isLoading = false;

  constructor(isLoading, filterType) {
    super();
    this.#isLoading = isLoading;
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointViewTemplate(this.#isLoading, this.#filterType);
  }
}
