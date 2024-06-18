import { Update } from '../constants.js';
import Observable from '../framework/observable.js';
import { adaptToClient, updateItem, sortByDay } from '../utils.js';

export default class PointModel extends Observable {
  #pointApiService = null;
  #points = [];

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
    this.#points = [];
  }

  get points() {
    return this.#points.sort(sortByDay);
  }

  async init() {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map(adaptToClient);
    } catch(err) {
      this.#points = [];
    }
    this._notify(Update.INIT);
  }

  async updatePoint(updateType, update) {
    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatePoint = adaptToClient(response);
      this.#points = updateItem(this.#points, updatePoint);
      this._notify(updateType, updatePoint);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointApiService.addPoint(update);
      const newPoint = adaptToClient(response);
      this.#points.push(newPoint);
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    try {
      await this.#pointApiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }
}

