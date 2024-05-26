import AbstractView from '../framework/view/abstract-view.js';

const getOfferTemplate = () => '';

export default class OfferView extends AbstractView {
  #offer = null;

  constructor(item) {
    super();
    this.#offer = item;
  }

  getTemplate() {
    return getOfferTemplate();
  }
}
