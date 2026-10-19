const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth');
const CartController = require('../../controllers/users/cartController');

router.use(authenticate)


router.post('/cart',CartController.addtoCart)


module.exports = router