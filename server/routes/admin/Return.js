const express = require('express')
const router = express.Router()
const {authenticateAdmin,authenticate} = require('../../middilewares/auth')
const ReturnController = require('../../controllers/Admin/ReturnController')

//user


router.post('/return',authenticate,ReturnController.generateReturn)


//admin
router.post("/return/:returnId/status",authenticateAdmin,ReturnController.updateReturnStatus);
router.get("/returns",authenticateAdmin,ReturnController.getAllReturns);

module.exports = router