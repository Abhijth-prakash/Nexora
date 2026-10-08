const logger = require("../utils/logger")

class ProductService{

    static async addProduct(){
        try{

        }catch(error){
            logger.error('failed to add product',error)
            throw error
        }
    }

}

module.exports = ProductService