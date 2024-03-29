import { getRandomElement, getRandomInteger } from '../utils.js';
import { Price, TYPES, Duration } from '../constants.js';
import dayjs from 'dayjs';
import { generateOffer } from './offer.js';
import { generateDestination } from './destination.js';

let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

const getDate = ({ next }) => {
  const minsGap = getRandomInteger(0, Duration.MIN);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }
  return date;
};

const generatePoint = () => ({
  id: crypto.randomUUID(),
  basePrice: getRandomInteger(Price.MIN, Price.MAX),
  dateFrom: getDate({ next: false }),
  dateTo: getDate({ next: true }),
  destination: generateDestination(),
  isFavorite: getRandomInteger(0, 1),
  offers: [generateOffer(crypto.randomUUID())],
  type: getRandomElement(TYPES)
});

export { generatePoint };
