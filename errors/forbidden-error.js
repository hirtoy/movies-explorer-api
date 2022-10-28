const { STATUS_INTERNAL_SERVER_ERROR } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = ForbiddenError;
