require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const NotFoundError = require('./errors/not-found-error');
// const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

app.use(cors);

function main() {
  try {
    mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    app.listen(PORT);
    // eslint-disable-next-line no-console
    console.log(`Слушаем ${PORT}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.message);
  }
}

main();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundError('Старницы несуществует'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});
