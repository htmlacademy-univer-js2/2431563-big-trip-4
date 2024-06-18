import { RenderPosition, render } from './framework/render.js';
import PointsApiService from './points-api-server.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/points-model.js';
import OfferModel from './model/offer-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import DestinationModel from './model/destination-model.js';

const AUTHORIZATION = 'Basic hs8JlpqSS93hf7A1';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const siteHeaderElement = document.querySelector('.trip-main');
const filterElement = siteHeaderElement .querySelector('.trip-controls__filters');
const siteContentElement = document.querySelector('.trip-events');
const pointApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offerModel = new OfferModel(pointApiService);
const destinationModel = new DestinationModel(pointApiService);
const filterModel = new FilterModel();
const pointModel = new PointModel(pointApiService);

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointModel
});

const boardPresenter = new BoardPresenter({
  tripMainContainer: siteHeaderElement ,
  eventsContainer: siteContentElement,
  pointModel,
  offerModel,
  destinationModel,
  filterModel,
  onNewPointDestroy: onAddFormClose
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: onNewEventButtonClick,
});

function onAddFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function onNewEventButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
boardPresenter.init();
offerModel.init().finally(() => {
  destinationModel.init().finally(() => {
    pointModel.init().finally(() => {
      render(newPointButtonComponent, siteHeaderElement , RenderPosition.BEFOREEND);
    });
  });
});
