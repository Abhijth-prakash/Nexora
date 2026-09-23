const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const AdminUserController = require('../../controllers/Admin/adminUserController')

router.use(authenticateAdmin)

router.get('/users/view',AdminUserController.getUsers)

module.exports = router