const express = require('express')
var router = express.Router()

const hireController = require('../controllers/hireController');

router.get('/get-hires', hireController.getAllHires)
router.get('/get-hires-unconfirm', hireController.getUnconfirmedHires)
router.post('/hire-form', hireController.createHire)
router.post('/confirm/:id', hireController.confirmHire);
router.delete('/delete/:id', hireController.deleteHire);

module.exports = router;