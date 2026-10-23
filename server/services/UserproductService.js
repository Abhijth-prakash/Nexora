const {Category,Subcategory} = require("../models/Category")
const { NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")
const Product = require('../models/Product')
const config = require('../config/config')
 

class UserproductService{

    //getproducts
 static async getProducts(
    limit,
    slug,
    page,
    subCategory,
    category,
    brand,
    minprice,
    maxprice,
    sort
) {
    try {
        const uncategorisedId = config.UncategorisedId;
        console.log(uncategorisedId)
        const currentlimit = Number(limit);
        const currentPage = Number(page);

        const skip = (currentPage - 1) * currentlimit;

        const query = {
            visible: true,
            $and: [
                { category: { $ne: uncategorisedId } }
            ]
        };

        if (slug) {
            query.$and.push({ category: slug });
        }

        if (category) {
            query.$and.push({ category: category });
        }

        if (subCategory) {
            query.subCategory = subCategory;
        }

        if (brand && brand.length > 0) {
            query.brand = { $in: brand };
        }

        const min = Number(minprice);
        const max = Number(maxprice);

        if (min > 0 || max > 0) {
            query.price = {};

            if (min > 0) {
                query.price.$gte = min;
            }

            if (max > 0) {
                query.price.$lte = max;
            }
        }

        const sortMap = {
            low: { price: 1, _id: 1 },
            high: { price: -1, _id: 1 },
            new: { createdAt: -1, _id: 1 },
        };

        const product = await Product.find(query)
            .sort(sortMap[sort] || { createdAt: -1, _id: 1 })
            .skip(skip)
            .limit(currentlimit)
            .populate("category", "name")
            .populate("subCategory", "name");

        logger.info("products fetched for userside");

        return product;
    } catch (error) {
        logger.error("failed to fetch products", error);
        throw error;
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