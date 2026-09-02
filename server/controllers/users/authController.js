const BaseController = require('../baseController')
const Users = require('../../models/User')
const bcrypt = require('bcrypt')
const Authservice = require('../../services/Authservice')




class AuthController extends BaseController{
    static register = BaseController.asyncHandler(async(req,res,next)=>{

        const result = await Authservice.register(req.body)

    
 

    return this.sendSuccessResponse(
        res,"user created succesfully",user,201
    )
    })

    
}


module.exports = AuthController