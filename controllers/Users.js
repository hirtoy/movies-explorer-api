const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { STATUS_OK } = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hashedPassword = bcrypt.hash(password, 10);
    const user = User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    res.status(STATUS_OK).send({
      data: user.toJSON(),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
      return;
    }
    next(err);
  }
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь с указанным id не найден'));
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Невалидный id пользователя'));
      return;
    }
    next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ data: user.toJSON() });
  } catch (err) {
    next(new UnauthorizedError('Неправильные почта или пароль'));
  }
};

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt', {
  }).send();
};

module.exports.getUserInfo = (req, res, next) => {
  try {
    const user = User.findById({ _id: req.user._id });
    if (!user) {
      next(new NotFoundError('Пользователь по указанному id не найден'));
      return;
    }
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  try {
    const user = User.findById(id);
    if (!user) {
      next(new NotFoundError('Пользователь по указанному id не найден'));
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Невалидный id пользователя'));
      return;
    }
    next(err);
  }
};