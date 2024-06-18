import AbstractView from '../framework/view/abstract-view.js';
import { getPointsDataRange, getTripPrice, getTripRoute } from '../utils.js';
import { OFFER_COUNT } from '../constants.js';

function createTripInfoTemplate({ dateRange, destinations, totalPrice }) {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations.length > OFFER_COUNT ? `${destinations[0]} &mdash; ... &mdash; ${destinations.at(-1)}` : destinations.join(' &mdash; ')}</h1>

        <p class="trip-info__dates">${dateRange.startDate}&nbsp;&mdash;&nbsp;${dateRange.endDate}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #pointModel = null;
  #offerModel = null;
  #destinationModel = null;
  #dateRange = null;
  #destinations = null;
  #totalPrice = null;

  constructor(pointModel, offerModel, destinationModel) {
    super();
    this.#pointModel = pointModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#dateRange = getPointsDataRange(this.#pointModel.points);
    this.#destinations = getTripRoute(this.#pointModel.points, this.#destinationModel);
    this.#totalPrice = getTripPrice(this.#pointModel.points, this.#offerModel);
  }

  get template() {
    return createTripInfoTemplate({
      dateRange: this.#dateRange,
      destinations: this.#destinations,
      totalPrice: this.#totalPrice
    });
  }
}
