/* eslint-disable linebreak-style */
const validator = require('validator');

const validateURL = (url) => {
  const result = validator.isURL(url);

  if (!result) {
    throw new Error('Некорректный формат ссылки');
  }
  return url;
};

const validUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new Error('Некорректная ссылка');
  }
};

module.exports = {
  validateURL,
  validUrl,
};
