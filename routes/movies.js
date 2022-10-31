const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../utils/validate');

const router = express.Router();
const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../controllers/movies');

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
      thumbnail: Joi.string().required().custom(validateURL),
      trailerLink: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  createMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
