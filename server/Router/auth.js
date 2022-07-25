const express = require('express');
const router = express.Router();
const {createToken} = require('./middleware/auth');

router.post('/login',createToken);

module.exports = router;
