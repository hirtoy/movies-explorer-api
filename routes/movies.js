const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../controllers/Movies');

router.get('/movies', getMovies);

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      description: Joi.string().required(),
      year: Joi.string().required(),
      duration: Joi.number().integer().required(),
      director: Joi.string().required(),
      country: Joi.string().required(),
      movieId: Joi.number().integer().required(),
      thumbnail: Joi.string().required().regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m),
      trailerLink: Joi.string().required(),
      image: Joi.string().required().regex(/^https?:\/\/(www.){0,1}([0-9a-zA-Z_-]+\.){1,3}[a-zA-Z]+[A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/m),
    }),
  }),
  createMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().hex(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
