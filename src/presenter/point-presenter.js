import PointView from '../view/point-view.js';
import PointEditView from '../view/edit-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, Update } from '../constants.js';
import { isEscapeKey } from '../utils.js';
import { hasBigDifference } from '../utils.js';

export default class PointPresenter {
  #pointComponent = null;
  #pointEditViewComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #pointListContainer = null;
  #point = null;
  #destinations = null;
  #offersByType = null;
  #mode = Mode.DEFAULT;

  constructor({ eventListViewComponentElement: pointListContainer, destinationModel: destinations, offerModel: offersByType, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
  }

  init(point) {
    this.#point = point;
    const prevPointViewComponent = this.#pointComponent;
    const prevEditPointComponent = this.#pointEditViewComponent;
    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestination: this.#destinations.getDestinationById(point.destination),
      pointOffers: this.#offersByType .getOffersByType(point.type).offers,
      onClick: this.#handleOnClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditViewComponent = new PointEditView({
      point: this.#point,
      pointOffers: this.#offersByType .offers,
      pointDestinations: this.#destinations.destinations,
      onFormSubmit: this.#handleOnFormSubmit,
      onRollUpClick: this.#handleOnRollUpClick,
      onEditDelete: this.#handleOnDeleteEditPoint
    });

    if (prevPointViewComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointViewComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointViewComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditViewComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditViewComponent.reset(this.#point);
      this.#replaceEditToEvent();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditViewComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditViewComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditViewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditViewComponent.shake(resetFormState);
  }

  #replaceEventToEdit() {
    replace(this.#pointEditViewComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditToEvent() {
    replace(this.#pointComponent, this.#pointEditViewComponent);
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#pointEditViewComponent.reset(this.#point);
      this.#replaceEditToEvent();
    }
  };

  #handleOnClick = () => {
    this.#replaceEventToEdit();
  };

  #handleOnRollUpClick = () => {
    this.#pointEditViewComponent.reset(this.#point);
    this.#replaceEditToEvent();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      Update.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleOnFormSubmit = (update) => {
    const isMinorUpdate = hasBigDifference(update, this.#point);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? Update.MINOR : Update.PATCH,
      update,
    );
    this.#replaceEditToEvent();
  };

  #handleOnDeleteEditPoint = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      Update.MINOR,
      point,
    );
  };
}
