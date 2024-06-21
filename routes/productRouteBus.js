const express = require('express');
const router = express.Router();

// Route to render the product page
router.get('/product_bus', (req, res) => {
    res.render('product_bus');
});

module.exports = router;
