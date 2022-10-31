const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();

const NotFoundError = require('../errors/not-found-error');
const { signOut } = require('../controllers/users');

router.use(require('./celebrate'));

router.use(auth, require('./users'));
router.use(auth, require('./movies'));

router.post('/signout', auth, signOut);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
