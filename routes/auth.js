const express = require('express')
var router = express.Router()

const authController = require('../controllers/authController');

router.post('/sign-up', authController.signUp)
router.post('/sign-in', authController.signIn)
router.post('/verify', authController.verifyAccount)
router.post('/forgetPassword', authController.forgetPassword)
router.put('/updateAccount', authController.update)
router.put('/changePassword', authController.changePassword)

module.exports = router;