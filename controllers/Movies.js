const { STATUS_OK } = require('../utils/constants');

const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

// отображение всех фильмов
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

// создание фильма
module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(STATUS_OK).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

// удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError('Можнно удалять только свои фильмы');
      } else {
        return Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.send({ messege: 'Фильм успешно удален' });
          });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      next(err);
    });
};
