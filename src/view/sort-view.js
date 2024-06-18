import AbstractView from '../framework/view/abstract-view.js';
import { Sort } from '../constants.js';

function createSortItems(type, currentSortType) {
  return `<div class="trip-sort__item  trip-sort__item--${type}">
            <input id="sort-${type}" class="trip-sort__input visually-hidden" data-sort-type="${type}" type="radio" name="trip-sort" value="sort-${type}" ${currentSortType === type ? 'checked' : ''} ${type === 'event' || type === 'offer' ? 'disabled' : ''}>
            <label class="trip-sort__btn" for="sort-${type}">${type}</label>
          </div>`;
}

function createSortTemplate({ currentSortType }) {
  const sortItems = Object.values(Sort).map((type) =>
    createSortItems(type, currentSortType)).join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
           ${sortItems}
      </form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ onSortTypeChange, currentSortType }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate({
      currentSortType: this.#currentSortType
    });
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
