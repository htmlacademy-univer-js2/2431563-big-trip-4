import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilter) => {
  const { type, count } = filter;
  const isChecked = type === currentFilter ? 'checked' : '';
  const isDisabled = count === 0 ? 'disabled' : '';
  return `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked} ${isDisabled}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
};

const createFiltersTemplate = (filterItems, currentFilter) =>
  `<form class="trip-filters" action="#" method="get">
    ${filterItems.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#handleFilterTypeChange(event.target.value);
  };
}
