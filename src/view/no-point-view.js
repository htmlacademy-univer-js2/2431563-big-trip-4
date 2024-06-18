import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsText } from '../constants';

function createNoPointViewTemplate(isLoading) {
  const noPointTextValue = isLoading ? NoPointsText.LOADING : NoPointsText.NOPOINTS;
  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
}

export default class NoPointView extends AbstractView {
  #isLoading = false;

  constructor(isLoading) {
    super();
    this.#isLoading = isLoading;
  }

  get template() {
    return createNoPointViewTemplate(this.#isLoading);
  }
}
