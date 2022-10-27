const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();

const {
  updateUserProfile,
  getUserInfo,
} = require('../controllers/Users');

router.get('/users/me', getUserInfo);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUserProfile,
);

module.exports = router;
