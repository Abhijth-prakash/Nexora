const express = require('express')
const router = express.Router()
const CategoryController = require('../../controllers/Admin/CategoryController')


router.post('/test',CategoryController.addCategory)
router.get('/test',CategoryController.getCategories)

module.exports = router