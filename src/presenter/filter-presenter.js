import { render, replace, remove, RenderPosition } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { filter } from '../filter.js';
import { Filter, Update } from '../constants.js';
import TripInfoView from '../view/trip-info-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filterComponent = null;
  #pointsModel = null;
  #offerModel = null;
  #destinationModel = null;
  #tripInfoComponent = null;

  constructor({ filterContainer, filterModel, pointsModel, offerModel, destinationModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(Filter).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    this.#renderTripInfo();

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(Update.MAJOR, filterType);
  };

  #renderTripInfo() {
    const previousInfoComponent = this.#tripInfoComponent;
    const points = this.#pointsModel.points;

    if (points.length && this.#offerModel.offersByType.length && this.#destinationModel.destinations.length) {
      this.#tripInfoComponent = new TripInfoView(points, this.#getOverallTripPrice(points), this.#destinationModel.destinations);
    }

    if (previousInfoComponent) {
      replace(this.#tripInfoComponent, previousInfoComponent);
      remove(previousInfoComponent);
    } else if (this.#tripInfoComponent) {
      render(this.#tripInfoComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #getOverallTripPrice(points) {
    let sum = 0;
    points.forEach((point) => {
      sum += point.basePrice;
      const currentOffers = this.#offerModel.offersByType.find((offer) => offer.type === point.type).offers;
      point.offers.forEach((offer) => {
        sum += currentOffers.find((currentOffer) => currentOffer.id === offer).price;
      });
    });
    return sum;
  }
}
