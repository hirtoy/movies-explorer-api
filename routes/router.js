const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');

const NotFoundError = require('../errors/not-found-error');

routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

routes.use('*', NotFoundError);

module.exports = { routes };