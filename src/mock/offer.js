import { OFFERS } from '../constants.js';
import { getRandomElement, getRandomInteger } from '../utils.js';

const generateOffer = (id) => ({
  id: id,
  title: getRandomElement(OFFERS),
  price: getRandomInteger(1, 200)
});

export { generateOffer };
