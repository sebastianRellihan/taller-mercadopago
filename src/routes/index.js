const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get('/', indexController.home);

/* GET detail page */
router.get('/detail', indexController.detail);

router.get('/callback', indexController.callback);

router.post('/webhooks', indexController.webhooks);

/* POST /buy */
router.post('/buy', indexController.buy);

module.exports = router;
