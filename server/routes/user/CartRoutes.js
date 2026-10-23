const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth');
const CartController = require('../../controllers/users/cartController');

router.use(authenticate)

router.get('/cart',CartController.getCart)
router.post('/cart',CartController.addtoCart)
router.post("/cart/merge",CartController.mergeGuestCart);
router.patch("/cart/:itemId",CartController.updateCartItem);



module.exports = router