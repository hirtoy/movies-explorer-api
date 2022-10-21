const express = require('express');
const { celebrate, Joi } = require('celebrate');

const movieRoutes = express.Router();
const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../controllers/Movies');

movieRoutes.get('/', getMovies);

movieRoutes.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m),
    }),
  }),
  createMovie,
);

movieRoutes.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteMovie,
);

module.exports = { movieRoutes };