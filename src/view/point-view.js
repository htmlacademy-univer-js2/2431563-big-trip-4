import AbstractView from '../framework/view/abstract-view.js';
import { getDateDifference, getMonthAndDate, getTime } from '../utils.js';
import he from 'he';

function createPointTemplate({ point, pointDestination, pointOffers }) {
  const { type, offers, dateFrom, dateTo, basePrice, isFavorite } = point;
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  return (
    `<li class="trip-events__item">
        <div class="event">
            <time class="event__date" datetime=${dateFrom}>${getMonthAndDate(dateFrom)}</time>
            <div class="event__type">
              <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${type} ${he.encode(pointDestination ? pointDestination.name : '')}</h3>
            <div class="event__schedule">
              <p class="event__time">
                <time class="event__start-time" datetime="${dateFrom}">${getTime(dateFrom)}</time>
                &mdash;
                <time class="event__end-time" datetime="${dateTo}">${getTime(dateTo)}</time>
              </p>
              <p class="event__duration">${getDateDifference(dateFrom, dateTo)}</p>
            </div>
            <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
            ${createOffersElementTemplate(offers, pointOffers)}
            </ul>
            <button class="event__favorite-btn ${favoriteClass}" type="button">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </div>
      </li>`
  );
}

function createOffersElementTemplate(checkedOffers, offers) {
  const result = offers.map((offer) => checkedOffers.includes(offer.id) ? `
              <li class="event__offer">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </li>` : '').join('');
  return result;
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, pointDestination, pointOffers, onClick: onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destination = pointDestination;
    this.#offers = pointOffers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#clickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate({
      point: this.#point,
      pointDestination: this.#destination,
      pointOffers: this.#offers
    });
  }

  #clickHandler = (event) => {
    event.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (event) => {
    event.preventDefault();
    this.#handleFavoriteClick();
  };
}
