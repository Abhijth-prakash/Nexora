const express = require('express')
const router = express.Router();
const {authenticate} = require('../../middilewares/auth')
const AddressController = require('../../controllers/users/addressController')


router.get('/address',authenticate,AddressController.getAddress)


module.exports = router