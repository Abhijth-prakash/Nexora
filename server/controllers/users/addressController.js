const Address = require('../../models/Address');
const BaseController = require('../baseController');
const Addressservice = require('../../services/Addressservice');
const { AddressValidation } = require('../../utils/validation');


class AddressController extends BaseController{


    //get address
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


    //add address

    static addAddress = BaseController.asyncHandler(
        async(req,res)=>{   
            const id = req.userId
            const validateData = BaseController.validateRequest(AddressValidation,req.body)

             await Addressservice.addAddress(id,validateData)

             return this.sendSuccessResponse(
      res,
      "address added  for user",
      null,
      200
    )

        }
    )
    

}

module.exports = AddressController