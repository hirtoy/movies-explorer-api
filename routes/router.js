const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');

routes.use('/users', userRoutes);
routes.use('/movies', movieRoutes);

module.exports = { routes };