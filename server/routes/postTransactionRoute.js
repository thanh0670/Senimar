const express = require('express');
const router = express.Router();
const { postTransaction } = require('../controllers/postTransactionController');



router.route('/postTransaction').post(postTransaction);

module.exports = router;
