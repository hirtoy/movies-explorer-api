const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/gi.test(v);
      },
      message: (props) => `${props.value} неверный адрес`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.toJSON = function hideCredentials() {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
  next,
) {
  const user = this.findOne({ email }).select('+password');
  if (!user) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);