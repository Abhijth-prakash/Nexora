const logger = require("../utils/logger")



class UserproductService{
    static async getProducts(){
        try{
            logger.info('succesfully fetched products')
            return true

        }catch(error){
            logger.error('failed to fetch products')
            throw error
        }
    }
}

module.exports = UserproductService