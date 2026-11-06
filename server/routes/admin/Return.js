const express = require('express')
const router = express.Router()
const {authenticateAdmin,authenticate} = require('../../middilewares/auth')
const ReturnController = require('../../controllers/Admin/ReturnController')

//user
router.post('/return',authenticate,ReturnController.generateReturn)
router.get('/return',authenticate,ReturnController.getUserReturns)

//admin
router.post("/return/:returnId/status",authenticateAdmin,ReturnController.updateReturnStatus);
router.get("/returns",authenticateAdmin,ReturnController.getAllReturns);

module.exports = router