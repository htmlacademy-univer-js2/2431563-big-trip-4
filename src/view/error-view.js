import AbstractView from '../framework/view/abstract-view.js';

const cretaeErrorTemplate = () => (
  `<p class="trip-events__msg">Some data couldn't be loaded.<br>
  Please, try to reload this page or visit it later.</p>`
);

export default class ErrorView extends AbstractView {
  get template() {
    return cretaeErrorTemplate();
  }
}
