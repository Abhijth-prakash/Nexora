const express = require('express')
const router = express.Router()
const AdminController = require('../../controllers/Admin/adminController')


router.post('/login',AdminController.login)


module.exports = router