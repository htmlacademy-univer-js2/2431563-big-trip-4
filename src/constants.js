import dayjs from 'dayjs';

const OFFER_COUNT = 3;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const TYPES = [
  'Taxi',
  'Bus',
  'Drive',
  'Check-in',
  'Flight',
  'Restaurant',
  'Sightseeing',
  'Train',
  'Ship',
];

const Filter = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const Sort = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const Update = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const EMPTY_POINT = {
  type: 'flight',
  basePrice: 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination: null,
  isFavorite: false,
  offers: []
};

const ButtonText = {
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  DELETING: 'Deleting',
  SAVE: 'Save',
  SAVING: 'Saving',
};

const NoPointsText = {
  NOPOINTS: 'Click New Event to create your first point',
  LOADING: 'Loading...',

};

export {
  TYPES, Filter, Mode, Sort, UserAction, Update, NoPointsText, ButtonText, EMPTY_POINT,
  TimeLimit, OFFER_COUNT
};
