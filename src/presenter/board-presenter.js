import { render } from '../render.js';
import EditPointView from '../view/edit-point-view.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(new SortView(), this.container);
    render(this.eventListComponent, this.container);

    render(new EditPointView, this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView, this.eventListComponent.getElement());
    }
  }
}
