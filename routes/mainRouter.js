const express = require("express")
const router = express.Router()
const controller = require('../controllers/mainController')
const validator = require('../middle/validator')

router.post('/register', validator.validateRegister, controller.register)
router.post('/login', validator.validateLogin, controller.login)
router.post('/check', controller.check)
router.post('/addthread', validator.validateThread, controller.addThread)
router.post('/changepicture', validator.validatePictureChange, controller.changePicture)
router.post('/addcomment', validator.validateComment, controller.addComment)

module.exports = router