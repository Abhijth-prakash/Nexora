const express = require('express')
const router = express.Router()
const userController = require('../../controllers/users/userController')




router.get('/register',userController.register)


module.exports = router