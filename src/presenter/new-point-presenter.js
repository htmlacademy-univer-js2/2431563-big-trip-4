import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, Update } from '../constants.js';
import { isEscapeKey } from '../utils.js';
import PointEditView from '../view/edit-point-view.js';

export default class NewPointPresenter {
  #destinations = null;
  #offersByType = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointListContainer = null;
  #editPointComponent = null;

  constructor({ pointListContainer, destinationModel: destinations, offerModel: offersByType, changeDataHandler: onDataChange, destroyHandler: onDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new PointEditView({
      pointDestinations: this.#destinations.destinations,
      pointOffers: this.#offersByType.offers,
      onFormSubmit: this.#handleEditSubmit,
      onEditDelete: this.#handleResetClick,
      isNewPoint: true
    });
    render(this.#editPointComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
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

  setSaving() {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #handleEditSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      Update.MINOR,
      point,
    );
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      this.destroy();
    }
  };
}
