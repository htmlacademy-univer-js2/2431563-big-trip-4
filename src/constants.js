const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const RANDOM_IMG_URL = 'https://loremflickr.com/248/152?random=';

const MSEC_IN_HOUR = 1000 * 60 * 60;
const MSEC_IN_DAY = 1000 * 60 * 60 * 24;

const Price = {
  MIN: 0,
  MAX: 1000
};

const Duration = {
  DAY: 5,
  HOUR: 5,
  MIN: 59,
};

const CITIES = [
  'Amsterdam',
  'Geneva',
  'Chamomix'
];

const TYPES = [
  { title: 'Taxi', img: 'img/icons/taxi.png' },
  { title: 'Bus', img: 'img/icons/bus.png' },
  { title: 'Drive', img: 'img/icons/drive.png' },
  { title: 'Check-in', img: 'img/icons/check-in.png' },
  { title: 'Flight', img: 'img/icons/flight.png' },
  { title: 'Restaurant', img: 'img/icons/restaurant.png' },
  { title: 'Sightseeing', img: 'img/icons/sightseeing.png' },
  { title: 'Train', img: 'img/icons/train.png' }
];

const OFFERS = [
  'Add a child safety seat',
  'Stay overnight',
  'Add lunch',
  'Rent a polaroid',
  'Add a place for a pet',
  'Book a window seat',
  'Book a place in the recreation area',
  'Use the translator service',
  'Upgrade to a business class'
];

const POINT_COUNT = 20;

export {
  LOREM_SENTENCES, RANDOM_IMG_URL,
  MSEC_IN_DAY, MSEC_IN_HOUR,
  Price, Duration, CITIES, TYPES, OFFERS, POINT_COUNT
};
