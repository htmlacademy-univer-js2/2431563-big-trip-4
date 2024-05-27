import { CITIES } from '../constants.js';
import { getRandomImageURL, getRandomLoremSentence } from '../utils.js';

const PICTURE_COUNT = 4;

const generatePicture = (city) => {
  const picture = {
    src: getRandomImageURL(),
    description: `${city}`
  };

  return picture;
};

const generateDestination = (city) => {
  const destination = {
    id: crypto.randomUUID(),
    name: city,
    description: getRandomLoremSentence(),
    pictures: Array.from({ length: PICTURE_COUNT }, () => generatePicture(city))
  };

  return destination;
};

const generateDestinations = () => CITIES.map((city) => generateDestination(city));

export { generateDestination, generateDestinations };
