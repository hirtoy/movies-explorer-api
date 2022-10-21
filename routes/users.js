const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();

const {
  // getUserById,
  updateUserProfile,
  getUserInfo,
} = require('../controllers/users');


userRoutes.get('/me', getUserInfo);

// userRoutes.get(
//   '/:id',
//   celebrate({
//     params: Joi.object().keys({
//       id: Joi.string().required().length(24).hex(),
//     }),
//   }),
//   getUserById,
// );

userRoutes.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserProfile,
);

module.exports = { userRoutes };