import { remove, render, RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';
import { Sort, UserAction, Update, Filter, TimeLimit } from '../constants.js';
import { sortByOffers, sortByPrice, sortByTime } from '../utils.js';
import { filter } from '../filter.js';

export default class BoardPresenter {
  #container = null;
  #eventsContainer = null;
  #pointModel = null;
  #filterModel = null;
  #offerModel = null;
  #destinationModel = null;
  #sortComponent = null;
  #noPointsComponent = null;
  #tripInfoViewComponent = null;
  #isLoading = true;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #eventListComponent = new EventListView();
  #currentSortType = Sort.DAY;
  #filterType = Filter.EVERYTHING;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ tripMainContainer: container, eventsContainer, pointModel, destinationModel, offerModel, filterModel, onNewPointDestroy }) {
    this.#container = container;
    this.#eventsContainer = eventsContainer;
    this.#pointModel = pointModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent,
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel,
      changeDataHandler: this.#handleViewAction,
      destroyHandler: onNewPointDestroy
    });

    this.#pointModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case Sort.TIME:
        return filteredPoints.sort(sortByTime);
      case Sort.PRICE:
        return filteredPoints.sort(sortByPrice);
      case Sort.OFFERS:
        return filteredPoints.sort(sortByOffers);
    }

    return filteredPoints;
  }

  createPoint() {
    this.#currentSortType = Sort.DAY;
    this.#filterModel.setFilter(Update.MAJOR, Filter.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = Sort.DAY;
    }
  }

  #renderTripInfoView() {
    if (this.#tripInfoViewComponent !== null) {
      remove(this.#tripInfoViewComponent);
    }

    this.#tripInfoViewComponent = new TripInfoView(this.#pointModel, this.#offerModel, this.#destinationModel);

    render(this.#tripInfoViewComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderSortView() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    render(this.#sortComponent, this.#eventListComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderPointList() {
    render(this.#eventListComponent, this.#eventsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventListViewComponentElement: this.#eventListComponent.element,
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    if (this.#noPointsComponent !== null) {
      remove(this.#noPointsComponent);
    }

    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPointView() {
    this.#noPointsComponent = new NoPointView(this.#isLoading);

    render(this.#noPointsComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderBoard() {
    if (this.points.length === 0 || this.#isLoading) {
      this.#renderNoPointView();
      return;
    }

    this.#renderPointList();
    this.#renderPoints();
    this.#renderTripInfoView();

    this.#renderSortView();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case Update.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case Update.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case Update.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case Update.INIT:
        this.#isLoading = false;
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({ resetRenderedTaskCount: true });
    this.#renderBoard();
  };
}
