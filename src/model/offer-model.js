import Observable from '../framework/observable.js';

export default class OfferModel extends Observable {
  #pointApiService = null;
  #offersByType = [];

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  async init() {
    try {
      this.#offersByType = await this.#pointApiService.offersByType;
    } catch (error) {
      this.#offersByType = [];
    }
  }

  get offersByType() {
    return this.#offersByType;
  }
}
