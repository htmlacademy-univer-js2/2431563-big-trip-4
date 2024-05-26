import { render, RenderPosition } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';
import OffersModel from '../model/offers-model.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #eventListComponent = new EventListView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();

  #boardPoints = [];
  #pointPresenters = new Map();

  #currentSortType = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
  }

  init() {
    this.#renderBoard();
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
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

  #handleSortTypeChange = () => {

  };

  #sortPoints = (sortType) => {
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
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderPointList();

    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#boardPoints.forEach((point) => this.#renderPoint(point));
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearTaskList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
