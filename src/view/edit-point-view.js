import { TYPES } from '../constants.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalize, humanizeEventTime } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createPointOffersTemplate = (point, offersByType, disabledTag) => {
  const { offers } = point;
  if (offersByType.length) {
    const eventOffersByType = offersByType.map((offer) => {
      const checked = offers.includes(offer.id) ? 'checked' : '';
      const titleClass = offer.title.toLowerCase().replace(' ', '-');
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleClass}-1" data-offer-title="${offer.title}" type="checkbox" name="event-offer-${titleClass}" ${checked} ${disabledTag}>
          <label class="event__offer-label" for="event-offer-${titleClass}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    }).join('');
    return `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${eventOffersByType}
        </div>
      </section>`;
  }
  return '<section class="event__section  event__section--offers"></section>';
};

const createPointDestinationsTemplate = (destination) => {
  if (destination.description.length || destination.pictures.length) {
    const pictures = destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
    return `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures}
          </div>
        </div>
      </section>`;
  }
  return '<section class="event__section  event__section--destination"></section>';
};

const createPointTypeFields = (currentType) => {
  const array = Array.from(TYPES, (type) => {
    const isChecked = type === currentType ? 'checked' : '';
    const eventType = type.title;

    return `<div class="event__type-item">
                  <input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.toLowerCase()}" ${isChecked}>
                  <label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
                </div>`;
  }).join('');
  return array;
};


const getEditPointTemplate = (point, offersByType, destinations, destinationsNames, isNewEvent) => {
  const { basePrice, dateFrom, dateTo, destination, type, isSaving, isDeleting, isDisabled } = point;
  const rollUpButton = isNewEvent ? '' :
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
  const currentDestination = destinations.find((place) => place.id === destination);
  const disabledTag = isDisabled ? 'disabled' : '';
  const deleteMessage = isDeleting ? 'Deleting...' : 'Delete';

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabledTag}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypeFields(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1" autocomplete="off" ${disabledTag}>
            <datalist id="destination-list-1">
              ${Array.from(destinationsNames, (place) => `<option value="${place}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeEventTime(dateFrom, 'DD/MM/YY HH:mm')}" ${disabledTag}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeEventTime(dateTo, 'DD/MM/YY HH:mm')}" ${disabledTag}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${disabledTag}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || basePrice === 0 ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${disabledTag}>${isNewEvent ? 'Cancel' : deleteMessage}</button>
          ${rollUpButton}
        </header>
        <section class="event__details">
          ${createPointOffersTemplate(point, offersByType, disabledTag)}
          ${createPointDestinationsTemplate(currentDestination)}
        </section>
      </form>
    </li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #offersByType = null;
  #offersByCurrentType = null;
  #destinations = null;
  #destinationNames = null;
  #isNewEvent = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepicker = null;

  constructor({ point, offersByType, destinations, destinationNames, onFormSubmit, onDeleteClick, isNewEvent = false }) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#point = point;
    this.#offersByType = offersByType;
    this.#offersByCurrentType = this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === point.type).offers : [];
    this.#destinations = destinations;
    this.#destinationNames = destinationNames;
    this.#isNewEvent = isNewEvent;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this._setHandlers();
  }

  get template() {
    return getEditPointTemplate(EditPointView.parseStateToPoint(this._state), this.#offersByCurrentType, this.#destinations, this.#destinationNames);
  }

  #typeChangeHandler = (event) => {
    event.preventDefault();
    const newType = TYPES.filter((type) => type.title === capitalize(event.target.value))[0];
    this.updateElement({ type: newType });
  };

  #formSubmitHandler = (event) => {
    event.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #destinationInputHandler = (event) => {
    if (!this.#destinationNames.includes(event.target.value)) {
      return;
    }
    event.preventDefault();
    this.updateElement({
      destination: this.#destinations.find((destination) => destination.name === event.target.value).id,
    });
  };

  #priceInputHandler = (event) => {
    event.preventDefault();
    const newPrice = Math.abs(Number(event.target.value.replace(/[^\d]/g, '')));
    this.updateElement({ basePrice: newPrice });
    this._setState({ basePrice: newPrice });
  };

  #formDeleteClickHandler = (event) => {
    event.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point) {
    this.#updateOffersByCurrentType(point.type);
    this.updateElement({
      offers: point.offers,
    });
    this.updateElement(
      EditPointView.parsePointToState(point),
    );
  }

  #updateOffersByCurrentType(newType) {
    this.#offersByCurrentType = this.#offersByType.length ? this.#offersByType.find((offer) => offer.type === newType).offers : [];
  }

  _setHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmitHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__type-group').addEventListener('click', this.#pointTypeClickHandler);

    if (this.#offersByType.length && this.#offersByCurrentType.length) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerClickHandler);
    }

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #pointTypeClickHandler = (event) => {
    if (event.target.tagName !== 'INPUT') {
      return;
    }
    event.preventDefault();
    this.#updateOffersByCurrentType(event.target.value);
    this.updateElement({
      type: event.target.value,
    });
  };

  _restoreHandlers() {
    this._setHandlers();
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeChangeHandler);
  }

  #pointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #pointDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #offerClickHandler = (event) => {
    if (event.target.tagName !== 'INPUT') {
      return;
    }
    event.preventDefault();
    const newOffer = this.#offersByCurrentType.find((offer) => offer.title === event.target.dataset.offerTitle).id;
    if (this._state.offers.includes(newOffer)) {
      this._state.offers.splice(this._state.offers.indexOf(newOffer), 1);
    } else {
      this._state.offers.push(newOffer);
    }
    this.updateElement({
      offers: this._state.offers,
    });
  };

  #setDatepickerFrom = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        maxDate: this._state.dateTo,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointDateFromChangeHandler,
      },
    );
  };

  #setDatepickerTo = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        minDate: this._state.dateFrom,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointDateToChangeHandler,
      },
    );
  };

  static parsePointToState = (point) => point;
  static parseStateToPoint = (state) => state;
}
