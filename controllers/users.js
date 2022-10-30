const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { STATUS_OK } = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(STATUS_OK).send({
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('При регистрации пользователя произошла ошибка'));
        return;
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }

      next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Некорректный id пользователя');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new UnauthorizedError('Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // const userData = {
      //   name: user.name,
      //   email: user.email,
      //   _id: user._id,
      //   token,
      // };
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неверный логин или пароль'));
    });
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
