import dayjs from 'dayjs';

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function getPointsDataRange(points) {
  const startDate = getMonDayYearDate(points[0].dateFrom);
  const pointWithEndDate = points.reduce((maxDatePoint, currentPoint) =>
    (dayjs(maxDatePoint.dateTo) < dayjs(currentPoint.dateTo)) ? currentPoint : maxDatePoint);
  const endDate = getMonDayYearDate(pointWithEndDate.dateTo);

  return { startDate, endDate };
}

function getDateDifference(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom), 'm') + 1;

  if (difference / 1440 > 1) {
    return `${Math.floor(difference / 1440)} D ${Math.floor(difference % 1440 / 60)} H ${Math.floor(difference % 60)} M`;
  }

  if (difference / 60 > 1) {
    return `${Math.floor(difference / 60)} H ${Math.floor(difference % 60)} M`;
  }

  return `${Math.floor(difference)} M`;
}

function getTime(date) {
  return dayjs(date).format('hh:mm');
}

function getMonthAndDate(date) {
  return dayjs(date).format('MMM DD');
}

function getMonDayYearDate(date) {
  return dayjs(date).format('MMM DD YYYY');
}

function getFullDate(date) {
  return dayjs(date).format('DD/MM/YY hh:mm');
}

function isPointInTheFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointInThePresent(point) {
  return dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
}

function isPointInThePast(point) {
  return dayjs().isAfter(point.dateTo);
}

function sortByTime(pointA, pointB) {
  const timeFrom = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  const timeTo = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));

  return timeFrom - timeTo;
}

function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortByOffers(pointA, pointB) {
  return pointA.offers.length - pointB.offers.length;
}

function sortByDay(pointA, pointB) {
  const timeA = dayjs(pointA.dateFrom);
  const timeB = dayjs(pointB.dateFrom);

  return timeA - timeB;
}

function hasBigDifference(point1, point2) {
  return point1.price !== point2.price
    || getDateDifference(point1.dateFrom, point1.dateTo) !== getDateDifference(point2.dateFrom, point2.dateTo)
    || point1.destination !== point2.destination
    || point1.offers !== point2.offers;
}

function getTripRoute(points, destinationModel) {
  const destinations = [];

  points.forEach((point) => {
    destinations.push(destinationModel.getDestinationById(point.destination).name);
  });

  return destinations;
}

function getTripPrice(points, offerModel) {
  let result = 0;

  points.forEach((point) => {
    result += point.basePrice;
    result += getPointOffersPrice(point, offerModel);
  });

  return result;
}

function getPointOffersPrice(point, offerModel) {
  let result = 0;
  const pointOffers = offerModel.getOffersByType(point.type).offers;

  pointOffers.forEach((offer) => {
    if (point.offers.includes(offer.id)) {
      result += offer.price;
    }
  });

  return result;
}

function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
    'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
    'base_price': Number(point.basePrice),
    'is_favorite': point.isFavorite
  };

  delete adaptedPoint.dateTo;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.isFavorite;
  delete adaptedPoint.basePrice;

  return adaptedPoint;
}

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
    basePrice: point['base_price'],
    isFavorite: point['is_favorite']
  };

  delete adaptedPoint['date_to'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['base_price'];
  delete adaptedPoint['is_favorite'];

  return adaptedPoint;
}

export {
  getPointsDataRange, getTripRoute, getTripPrice, adaptToClient, adaptToServer, updateItem, isEscapeKey, getDateDifference, getFullDate,
  getMonthAndDate, getTime, isPointInTheFuture, isPointInThePresent, isPointInThePast, sortByDay, sortByOffers, sortByPrice, sortByTime, hasBigDifference, getMonDayYearDate
};
