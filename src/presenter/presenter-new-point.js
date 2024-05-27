import { remove, render, RenderPosition } from '../framework/render.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../constants.js';
import EditPointView from '../view/edit-point-view.js';
import { generatePoint } from '../mock/point.js';

export default class NewPointPresenter {
  #taskListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #editPointComponent = null;

  constructor({ taskListContainer, onDataChange, onDestroy }) {
    this.#taskListContainer = taskListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      point: generatePoint(),
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#editPointComponent, this.#taskListContainer, RenderPosition.AFTERBEGIN);

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

  #handleFormSubmit = (task) => {
    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      { id: nanoid(), ...task },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
