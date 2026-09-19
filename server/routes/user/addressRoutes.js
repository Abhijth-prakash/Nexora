const express = require('express')
const router = express.Router();
const {authenticate} = require('../../middilewares/auth')
const AddressController = require('../../controllers/users/addressController')


router.get('/address',authenticate,AddressController.getAddress)
router.post('/address',authenticate,AddressController.addAddress)


module.exports = router