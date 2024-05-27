import AbstractView from '../framework/view/abstract-view.js';

const createLoadingTemplate = () => `<h2 class="visually-hidden">Trip events</h2>
<p class="trip-events__msg">Loading...</p>`;

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
