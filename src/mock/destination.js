import { CITIES } from '../constants.js';
import { getRandomElement, getRandomImageURL, getRandomLoremSentence } from '../utils.js';

const generateDestination = () => {
  const city = getRandomElement(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: getRandomLoremSentence(),
    pictures: [
      {
        'src': getRandomImageURL(),
        'description': `${city}`
      }
    ]
  };
};

export { generateDestination };
