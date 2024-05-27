import { render, remove, RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-point-view.js';
import LoadingView from '../view/load-view.js';
import PointPresenter from './presenter-point.js';
import NewPointPresenter from './presenter-new-point.js';
import { sortDay, sortPrice, sortTime } from '../utils.js';
import { Sort, UpdateType, UserAction, Filter } from '../constants.js';
import { filter } from '../filter.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #noPointsComponent = null;
  #eventListComponent = new EventListView();
  #loadingComponent = new LoadingView();

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = Sort.DAY;
  #filterType = Filter.ALL;
  #isLoading = true;

  constructor({ container, pointsModel, filterModel, onNewTaskDestroy }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      taskListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTaskDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case Sort.DAY:
        return filteredPoints.sort(sortDay);
      case Sort.PRICE:
        return filteredPoints.sort(sortPrice);
      case Sort.TIME:
        return filteredPoints.sort(sortTime);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = Sort.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, Filter.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = Sort.DAY;
    }

    this.#newPointPresenter.destroy();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearBoard(sortType);
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType,
    });

    render(this.#noPointsComponent, this.#container);
  }

  #renderPointList(points) {
    render(this.#eventListComponent, this.#container);
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderBoard() {
    const points = this.points;
    const pointCount = points.length;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (pointCount === 0) {
      this.#renderNoPoints();
    }
    this.#renderSort();
    this.#renderPointList(this.points);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };
}
