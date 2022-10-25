/* eslint-disable @typescript-eslint/no-var-requires */
const { CONFLICT_CODE } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_CODE;
  }
}

module.exports = ConflictError;
