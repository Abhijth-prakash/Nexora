const logger = require("../utils/logger")
const Product = require('../models/Product')
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");
const config = require('../config/config');
const uploadFile = require('../config/cloudinary');
const {Category,Subcategory} = require("../models/Category");

class ProductService {

    //ading product
    static async addProduct(data, files) {
        try {
            const existingProduct = await Product.findOne({
                name: data.name
            });

            if (existingProduct) {
                throw new ConflictError('product already exists');
            }

            const imageUrls = await Promise.all(
                files.map(async file => {
                    const result = await uploadFile(file.path);
                    return result.secure_url;
                })
            );

            const category = await Category.findOne({
                name: data.Category
            });

            if (!category) {
                throw new NotFoundError('category not found');
            }

            const subcategory = await Subcategory.findOne({
                name: data.Subcategory
            });

            if (!subcategory) {
                throw new NotFoundError('subcategory not found');
            }

            const newProduct = new Product({
                name: data.name,
                description: data.description,
                visible: data.visible,
                price: data.price,
                size: data.size,
                images: imageUrls,
                category: category._id,
                subCategory: subcategory._id
            });

            await newProduct.save();

            logger.info('new product added successfully');

            return newProduct;

        } catch (error) {
            logger.error('failed to add product', error);
            throw error;
        }
    }

static async visibleToggle(id) {
    try {
        const product = await Product.findById(id);

        if (!product) {
            throw new NotFoundError('product not found');
        }

       const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: { visible: !product.visible } },
    { returnDocument: 'after' }
);

        logger.info('product visibility toggled successfully');

        return updatedProduct;
    } catch (error) {
        logger.error('failed to toggle visibility', error);
        throw error;
    }
}
}

module.exports = ProductService;

