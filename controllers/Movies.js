const { STATUS_OK } = require('../utils/constants');

const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

//отображение всех фильмов
const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

//создание фильма
const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    trumbnail,
    movield,
    nameRU,
    nameEN } = req.body

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      trumbnail,
      movield,
      nameRU,
      nameEN, owner: req.user._id
    });
    res.status(STATUS_OK).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};


//удаление фильма
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById({ _id: req.params.movieId });
    if (!movie) {
      next(new NotFoundError('Фильм с указанным id не найден'));
      return;
    }
    if (movie.owner.toString() !== req.user._id) {
      next(new ForbiddenError('Можно удалять только свои фильмы'));
      return;
    }
    const delMovie = await Movie.findByIdAndRemove({ _id: req.params.movieId });
    res.send({ message: 'Фильм успешно удален', delMovie });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
};