const express = require('express')
const router = express.Router()
const {authenticate} = require('../../middilewares/auth')
const WalletController = require('../../controllers/users/walletController')



router.get('/wallet',WalletController.getWallet)


module.exports = router