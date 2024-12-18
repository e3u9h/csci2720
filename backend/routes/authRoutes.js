/*

DU Fangzhou 1155173892
DING Yuzhou 1155173825
WEI YOUlin  1155157186

*/
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;