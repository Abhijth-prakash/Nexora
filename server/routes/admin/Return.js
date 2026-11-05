const express = require('express')
const router = express.Router()
const {authenticateAdmin,authenticate} = require('../../middilewares/auth')
const ReturnController = require('../../controllers/Admin/ReturnController')


router.post('/return',authenticate,ReturnController.generateReturn)
router.post("/return/:returnId/status",authenticateAdmin,ReturnController.updateReturnStatus);

module.exports = router