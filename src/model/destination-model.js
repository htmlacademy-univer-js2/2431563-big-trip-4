export default class DestinationModel {
  #pointApiService = null;
  #destinations = [];

  constructor(pointApiService) {
    this.#pointApiService = pointApiService;
  }

  async init() {
    this.#destinations = await this.#pointApiService.destinations;
    return this.#destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((city) => city.id === id);
  }
}
