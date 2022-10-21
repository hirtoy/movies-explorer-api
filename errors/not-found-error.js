/* eslint-disable @typescript-eslint/no-var-requires */
const { NOT_FOUND_CODE } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_CODE;
  }
}

module.exports = NotFoundError;
