const express = require('express')
const router = express.Router()
const AdminController = require('../../controllers/Admin/adminController')


router.post('/login',AdminController.Login)
router.get('/logout',AdminController.Logout)
router.post('/forgetpass',AdminController.Forgetpassword)
router.post('/resetpass',AdminController.Resetpassword)


module.exports = router