import dayjs from 'dayjs';
import { LOREM_SENTENCES, RANDOM_IMG_URL, MSEC_IN_DAY, MSEC_IN_HOUR, TYPES } from './constants.js';

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomImageURL = () => `${RANDOM_IMG_URL}${crypto.randomUUID()}`;
const getRandomLoremSentence = () => getRandomElement(LOREM_SENTENCES);
const formatStringToShortDate = (string) => dayjs(string).format('MMM DD');
const formatStringToTime = (string) => dayjs(string).format('HH:mm');
const capitalize = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;
const humanizeEventTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();
const getPointDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  let pointDuration = 0;
  switch (true) {
    case (timeDiff > MSEC_IN_DAY):
      pointDuration = dayjs(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
};

const isPointInTheFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());
const isPointInThePast = (point) => {
  const currentDate = dayjs();
  const isStartDateBeforeOrEqual = dayjs(point.dateFrom).isBefore(currentDate) || dayjs(point.dateFrom).isSame(currentDate);
  const isEndDateAfterOrEqual = dayjs(point.dateTo).isAfter(currentDate) || dayjs(point.dateTo).isSame(currentDate);

  return isStartDateBeforeOrEqual && isEndDateAfterOrEqual;
};

const isPointInThePresent = (point) => dayjs(point.dateTo).isBefore(dayjs());
const sortPrice = (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice;
const sortDay = (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom));
const sortTime = (firstPoint, secondPoint) => {
  const timePointA = dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
  const timePointB = dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom));
  return timePointB - timePointA;
};

const areDatesSame = (oldDate, newDate) => dayjs(oldDate).isSame(dayjs(newDate));
const getTypeLogo = (type) => TYPES.find((t) => t.title.toLowerCase() === type.toLowerCase()).img;

export {
  getRandomImageURL, getRandomLoremSentence, getRandomInteger, getRandomElement,
  getPointDuration, capitalize, formatStringToShortDate, formatStringToTime,
  isPointInThePresent, isPointInTheFuture, isPointInThePast,
  sortDay, sortPrice, sortTime, areDatesSame, getTypeLogo, humanizeEventTime
};
