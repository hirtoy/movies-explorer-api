/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
// const UnauthorizedError = require('../errors/unauthorized-error');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { STATUS_OK } = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => res.status(STATUS_OK).send(user.deletePasswordFromUser()))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError(`Переданы некорректные данные для создания пользователя ${error.message}`));
          } else if (error.name === 'MongoServerError' && error.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )

    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))

    .then((user) => res.send(user))

    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные для изменения данных пользователя ${error.message}`));
      } else if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new ConflictError('Нельзя редактировать данные другого пользователя'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt', {
  }).send();
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя нет');
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
