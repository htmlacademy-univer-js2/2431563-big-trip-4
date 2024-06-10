import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, Update, TYPES } from '../constants.js';
import EditPointView from '../view/edit-point-view.js';
import dayjs from 'dayjs';

export default class NewPointPresenter {
  #destinations = null;
  #destinationNames = null;
  #offersByType = null;
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #editPointComponent = null;

  constructor({ pointListContainer, offersByType, destinations, destinationNames, onDataChange, onDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#destinationNames = destinationNames;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      point: this.#generateDefaultPoint(),
      offersByType: this.#offersByType,
      destinations: this.#destinations,
      destinationNames: this.#destinationNames,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });
    render(this.#editPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #generateDefaultPoint() {
    return {
      id: crypto.randomUUID(),
      basePrice: 0,
      dateFrom: dayjs().toDate(),
      dateTo: dayjs().add(1, 'm').toDate(),
      destination: this.#destinations[0].id,
      isFavorite: false,
      offers: [],
      type: TYPES[0].title,
    };
  }

  destroy() {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      Update.MINOR,
      point,
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this.destroy();
    }
  };
}
