const express = require('express');

const auth = require('../middlewares/Auth');

const router = express.Router();

const NotFoundError = require('../errors/not-found-error');

router.use(require('./celebrate'));
router.use(require('./users'));
router.use(require('./movies'));

router.use(auth);

router.use('*', NotFoundError);

module.exports = router;
