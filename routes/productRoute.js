const express = require('express');
const router = express.Router();

// Route to render the product page
router.get('/product', (req, res) => {
    res.render('product');
});

module.exports = router;
