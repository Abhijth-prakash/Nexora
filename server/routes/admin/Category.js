const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const CategoryController = require('../../controllers/Admin/CategoryController')

router.use(authenticateAdmin)

router.post('/category',CategoryController.addCategory)
router.get('/category',CategoryController.getCategories)
router.get('/category/:id',CategoryController.getCategory)
router.delete('/category/:id',CategoryController.deleteCategory)
router.patch('/category/:id',CategoryController.editCategory)

router.post('/category/hide/:id',CategoryController.Hidecategory)
router.post('/category/unhide/:id',CategoryController.unHidecategory)

module.exports = router