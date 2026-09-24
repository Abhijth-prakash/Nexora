const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const AdminUserController = require('../../controllers/Admin/adminUserController')

router.use(authenticateAdmin)

router.get('/users/view',AdminUserController.getUsers)
router.post('/users/block',AdminUserController.blockUser)
router.post('/users/unblock',AdminUserController.unblockUser)

module.exports = router