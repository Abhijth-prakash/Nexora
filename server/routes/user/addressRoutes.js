const express = require('express')
const router = express.Router();
const {authenticate} = require('../../middilewares/auth')
const AddressController = require('../../controllers/users/addressController')


router.get('/address',authenticate,AddressController.getAddress)
router.post('/address',authenticate,AddressController.addAddress)
router.patch('/address',authenticate,AddressController.updateAddress)
router.delete('/address',authenticate,AddressController.deleteAddress)


module.exports = router