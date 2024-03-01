import { createElement } from '../render.js';

const eventListTemplate = '<ul class="trip-events__list"></ul>';

export default class EventListView {
  getTemplate() {
    return eventListTemplate;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
