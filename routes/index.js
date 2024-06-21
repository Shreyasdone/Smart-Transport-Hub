const express = require('express');
const router = express.Router();

const paymentRoute = require('./paymentRoute');
const productRoute = require('./productRoute');
const productRouteBus = require('./productRouteBus');

router.use(paymentRoute);
router.use(productRoute);
router.use(productRouteBus);

module.exports = router;
