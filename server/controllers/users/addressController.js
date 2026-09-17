const Address = require('../../models/Address');
const BaseController = require('../baseController');
const Addressservice = require('../../services/Addressservice')


class AddressController extends BaseController{

    static getAddress = BaseController.asyncHandler(
        async(req,res)=>{
            const id = req.userId

            const result =  await Addressservice.getAddress(id)

             BaseController.logAction(
                  `address fetched for user `
                )

        return this.sendSuccessResponse(
      res,
      "address fetched for user",
      { address: result },
      200
    )

        }
    )

}

module.exports = AddressController