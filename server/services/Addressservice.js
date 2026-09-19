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

    //get address
    static async getAddress(id){
        try{    

        const address = await Address.find({user:id})
        return address

        }catch(error){
            logger.error('address fetch failed',error)
            throw error
        }

    }

    //add Address
 static async addAddress(id, data) {
  try {

    const size = await Address.countDocuments({ user: id })

    if (size >= 2) {
      throw new ConflictError(
        "Already 2 addresses present. Delete one to add more."
      )
    }

    const address = new Address({
      user: id,
      type: data.type,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
    })

    await address.save()

    logger.info(`New address added for user: ${id}`)

    return true

  } catch (error) {

    logger.error("Adding address failed", error)

    throw error
  }
}
}

module.exports = Addressservice