const router = require('express').Router();

router.use('/satellites', require('./satellites.route'));

module.exports = router;
