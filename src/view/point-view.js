import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToShortDate, getPointDuration, formatStringToTime, getTypeLogo } from '../utils.js';


const getPointTemplate = (point, offersByCurrentType, destination) => {
  const { basePrice, dateFrom, dateTo, isFavorite, offers, type } = point;
  const duration = getPointDuration(dateFrom, dateTo);
  const pointOffersByType = offersByCurrentType.length && offers.length ? offersByCurrentType.map(
    (offer) => !offers.includes(offer.id) ? '' : (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    )).join('') : '';

  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="2019-03-18">${formatStringToShortDate(dateFrom)}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="${getTypeLogo(type)}" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="2019-03-18T10:30">${formatStringToTime(dateFrom)}</time>
      &mdash;
      <time class="event__end-time" datetime="2019-03-18T11:00">${formatStringToTime(dateTo)}</time>
    </p>
    <p class="event__duration">${duration}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${pointOffersByType}
  </ul>
  <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
    <span class="visually-hidden" > Add to favorite</span >
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
      </svg>
  </button >
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div >
</li > `;
};

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, offers, destination, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return getPointTemplate(this.#point, this.#offers, this.#destination);
  }

  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (event) => {
    event.preventDefault();
    this.#handleFavoriteClick();
  };
}
