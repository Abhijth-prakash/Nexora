const express = require('express')
const router = express.Router()
const {authenticateAdmin} = require('../../middilewares/auth')
const CategoryController = require('../../controllers/Admin/CategoryController')
const upload = require('../../config/multer')

router.use(authenticateAdmin)


router.get('/category', CategoryController.getCategories);
router.get('/category/all', CategoryController.getallCategories);
router.get('/category/:id', CategoryController.getCategory);


router.post('/category', upload.single('image'), CategoryController.addCategory);
router.post('/category/hide/:id', CategoryController.Hidecategory);
router.post('/category/unhide/:id', CategoryController.unHidecategory);


router.patch('/category/:id', upload.single('image'), CategoryController.editCategory);


router.delete('/category/subCategory/:id/:subId', CategoryController.deleteSubcategory)
router.delete('/category/:id', CategoryController.deleteCategory);

module.exports = router