/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('./middlewares/cors');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;
const app = express();
app.use(express.json());

const options = {
  origin: [
    'http://localhost:3000',
    'https://hirtoy.nomoredomains.icu',
    'http://hirtoy.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};
app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundError('Старницы несуществует'));
});

app.use(errorLogger);
app.use(errors());

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/mestodb');

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT}`);
});
