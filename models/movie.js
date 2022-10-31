const mongoose = require('mongoose');
const validator = require('validator');

const validUrl = (value) => {
  if (!validator.isURL(value)) {
    throw new Error('Некорректная ссылка');
  }
};

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 4,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: { validator: validUrl },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: { validator: validUrl },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: { validator: validUrl },
  },
  owner: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
