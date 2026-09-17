const Address = require("../models/Address");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const Mail = require('../utils/mail')
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");


class Addressservice{
    static async getAddress(id){
        try{    

        const address = await Address.find({user:id})
        return address

        }catch(error){
            logger.error('address fetch failed',error)
            throw error
        }

    }
}

module.exports = Addressservice