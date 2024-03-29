import { render } from '../render.js';
import EditPointView from '../view/edit-point-view.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import { generatePoint } from '../mock/point.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();

  constructor({ container, pointsModel }) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(new SortView(), this.container);
    render(this.eventListComponent, this.container);

    render(new EditPointView(generatePoint()), this.eventListComponent.getElement());

    this.points.forEach((point) => {
      const newPoint = new PointView(point);
      render(newPoint, this.eventListComponent.getElement());
    });
  }
}
