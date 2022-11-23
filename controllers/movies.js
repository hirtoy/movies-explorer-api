const { STATUS_OK } = require('../utils/constants');

const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

// отображение всех фильмов
module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

// создание фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(STATUS_OK).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(error);
      }
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => new NotFoundError('Фильм с указанным id не существует'))
    .then((movie) => {
      if (movie && req.user._id !== movie.owner.toString()) {
        next(new ForbiddenError('Нельзя удалить фильм другого пользователя'));
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((deletedMovie) => res.send(deletedMovie))
          .catch(next);
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Удаление фильма с некорректным id'));
      } else {
        next(error);
      }
    });
};
