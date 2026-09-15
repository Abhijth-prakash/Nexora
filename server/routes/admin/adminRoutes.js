const express = require('express')
const router = express.Router()
const AdminController = require('../../controllers/Admin/adminController')


router.post('/login',AdminController.login)
router.post('/forgetpass',AdminController.Forgetpassword)
router.post('/resetpass',AdminController.Resetpassword)


module.exports = router