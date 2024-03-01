import { RenderPosition, render } from './render.js';
import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentElement = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({ container: siteContentElement });

render(new TripInfoView(), siteHeaderElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), siteFilterElement);

boardPresenter.init();
