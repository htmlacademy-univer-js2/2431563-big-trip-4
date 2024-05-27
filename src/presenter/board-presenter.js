import { render, RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem, sortDay, sortPrice, sortTime } from '../utils.js';
import OffersModel from '../model/offers-model.js';
import { Sort } from '../const.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #eventListComponent = new EventListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();

  #boardPoints = [];
  #pointPresenters = new Map();

  #currentSortType = Sort.DAY;
  #sourcedBoardPoints = [];

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];
  }

  init() {
    this.#renderBoard();
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      offersModel: new OffersModel(),
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case Sort.DAY:
        this.#boardPoints.sort(sortDay);
        break;
      case Sort.PRICE:
        this.#boardPoints.sort(sortPrice);
        break;
      case Sort.TIME:
        this.#boardPoints.sort(sortTime);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  };

  #renderSort() {
    this.#sortComponent = new SortView({ onSortTypeChange: this.#handleSortTypeChange });
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#eventListComponent);
  }

  #renderPointList() {
    render(this.#eventListComponent, this.#container);
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderBoard() {
    this.#renderSort();

    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
    }
    this.#renderPointList();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
