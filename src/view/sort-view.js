import AbstractView from '../framework/view/abstract-view.js';
import { Sort } from '../constants.js';

const sortTemplate = (currentSortType) => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
<div class="trip-sort__item  trip-sort__item--${Sort.DAY}">
  <input id="sort-${Sort.DAY}" data-sort-type="day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.DAY}" ${currentSortType === Sort.DAY ? 'checked' : ''} >
  <label class="trip-sort__btn" for="sort-${Sort.DAY}">Day</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.EVENT}" >
  <input id="sort-${Sort.EVENT}" data-sort-type="event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.EVENT}" disabled ${currentSortType === Sort.EVENT ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${Sort.EVENT}">Event</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.TIME}">
  <input id="sort-${Sort.TIME}"  data-sort-type="time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.TIME}"  ${currentSortType === Sort.TIME ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${Sort.TIME}">Time</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.PRICE}">
  <input id="sort-${Sort.PRICE}" data-sort-type="price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.PRICE}" ${currentSortType === Sort.PRICE ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${Sort.PRICE}">Price</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.OFFERS}">
  <input id="sort-${Sort.OFFERS}"  data-sort-type="offers" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.OFFERS}" disabled ${currentSortType === Sort.OFFERS ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${Sort.OFFERS}">Offers</label>
</div>
</form>`;

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler, { passive: true });
  }

  get template() {
    return sortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
