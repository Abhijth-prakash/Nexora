const {Category,Subcategory} = require("../models/Category")
const { NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")
const Product = require('../models/Product')


class UserproductService{

    //getproducts
    static async getProducts(limit,slug,page){
        try{
            
             const currentlimit = Number(limit) 
             const currentPage = Number(page)

             
             const skip = (currentPage-1) *limit
             const query= {}
             if(slug){
                query.category = slug
             }

            const category = await Product.find(query).limit(currentlimit).skip(skip)

            if(category.length ===0){
                throw new NotFoundError('products not found')
            }

            logger.info('products fetched for userside')
            return category

            logger.info('succesfully fetched products')
            return true

        }catch(error){
            logger.error('failed to fetch products')
            throw error
        }
    }



    //get product by id
    static async getProductByid(id) {
      try {
        const product = await Product.findById(id);
    
        if (!product) {
          throw new Error("Product not found");
        }
        logger.info(`fetched product ${product.name} for user`)
        return await product.populateDetails();
      } catch (error) {
        logger.error('failed to get product',error)
        throw error;
      }
    }



    //get categories
    static async getCategories(limit){
        try{
            const currentlimit = Number(limit) || 6
            const query ={}
            query.isVisible = true


            const category = await Category.find(query).limit(currentlimit)

            if(category.length ===0){
                throw new NotFoundError('category not found')
            }

            logger.info('categories fetched for userside')
            return category

        }catch(error){
            logger.error('failed to fetch categories')
            throw error
        }
    }


    //get category tree

    static async getCategoryTree() {
    const [categories, subcategories] = await Promise.all([
        Category.find({ isVisible: true }).sort({ name: 1 }).select('name slug').lean(),
        Subcategory.find({ isVisible: true }).select('name slug category').lean(),
    ])

    const subMap = {}
    subcategories.forEach(s => {
        (subMap[s.category] ||= []).push(s)
    })

    return categories.map(c => ({ ...c, subCategories: subMap[c._id] || [] }))
}
}

module.exports = UserproductService