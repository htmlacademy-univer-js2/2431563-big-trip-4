import AbstractView from '../framework/view/abstract-view.js';
import { Sort } from '../const.js';

const sortTemplate = () => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
<div class="trip-sort__item  trip-sort__item--${Sort.DAY}" data-sort-type="${Sort.DAY}">
  <input id="sort-${Sort.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.DAY}">
  <label class="trip-sort__btn" for="sort-${Sort.DAY}">Day</label>

  <div class="trip-sort__item  trip-sort__item--${Sort.EVENT}" data-sort-type="${Sort.EVENT}">
  <input id="sort-${Sort.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.EVENT}" disabled>
  <label class="trip-sort__btn" for="sort-${Sort.EVENT}">Event</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.TIME}" data-sort-type="${Sort.TIME}">
  <input id="sort-${Sort.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.TIME}">
  <label class="trip-sort__btn" for="sort-${Sort.TIME}">Time</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.PRICE}" data-sort-type="${Sort.PRICE}">
  <input id="sort-${Sort.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.PRICE}" checked>
  <label class="trip-sort__btn" for="sort-${Sort.PRICE}">Price</label>
</div>

<div class="trip-sort__item  trip-sort__item--${Sort.OFFERS}" data-sort-type="${Sort.OFFERS}">
  <input id="sort-${Sort.OFFERS}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${Sort.OFFERS}" disabled>
  <label class="trip-sort__btn" for="sort-${Sort.OFFERS}">Offers</label>
</div>
</form>`;

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return sortTemplate;
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefaul();

    this.#handleSortTypeChange();
  };
}
