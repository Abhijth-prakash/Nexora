const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const CategoryController = require('../../controllers/Admin/CategoryController')

router.use(authenticateAdmin)

router.post('/category',CategoryController.addCategorry)

module.exports = router