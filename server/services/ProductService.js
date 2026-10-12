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

            const category = await Category.findById(data.category)

            if (!category) {
                throw new NotFoundError('category not found');
            }

            const subcategory = await Subcategory.findById(data.subCategory);

            if (!subcategory) {
                throw new NotFoundError('subcategory not found');
            }

            const newProduct = new Product({
                name: data.name,
                description: data.description,
                brand:data.brand,
                color:data.color,
                stock:data.stock,
                visible: data.visible,
                price: data.price,
                size: data.size,
                images: imageUrls,
                category: category._id,
                subCategory: subcategory._id
            });

            await newProduct.save();
await Category.findByIdAndUpdate(category._id, {
  $inc: { productCount: 1 },
});

await Subcategory.updateOne(
  { _id: subcategory._id, category: category._id },
  {
    $inc: { productCount: 1 },
  }
);
            logger.info('new product added successfully');

            return null;

        } catch (error) {
            logger.error('failed to add product', error);
            throw error;
        }
    }


    //visiblity toggle
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




//delete product

static async Delete(id){
    try{

         const product = await Product.findById(id);

        if (!product) {
            throw new NotFoundError('product not found');
        }

        const deleteProduct = await Product.findByIdAndDelete(id)

        logger.info(`product deleted succesfully ${product.name}`)
        return true

    }catch(error){
        logger.error('failed to delete product')
        throw error
    }
}

//update product
static async updateProduct(id, data, files) {
    try {
        const product = await Product.findById(id);

        if (!product) {
            throw new NotFoundError('product not found');
        }

        let imageUrls = [];

        if (files && files.length > 0) {
            imageUrls = await Promise.all(
                files.map(async file => {
                    const result = await uploadFile(file.path);
                    return result.secure_url;
                })
            );
        }

        const updateData = {
            name: data.name,
            description: data.description,
            price: data.price,
            size: data.size,
            stock:data.stock,
            color:data.color
        };

        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        await Product.findByIdAndUpdate(id, { $set: updateData });

        logger.info(`succesfully updated product ${product.name}`);
        return true;

    } catch (error) {
        logger.error('failed to update product', error);
        throw error;
    }
}


//get all products

static async getProducts(page, search, sort) {
  try {
    const currentPage = page || 1;
    const limit = 8;
    const skip = (currentPage - 1) * limit;

    if (sort) {
      if (sort === "low") {
        sort = 1;
      } else {
        sort = -1;
      }
    }

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const totalProducts = await Product.countDocuments(query);

    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
  .populate("category", "name")
  .populate("subCategory", "name")
  .skip(skip)
  .sort(sort ? { price: sort } : {})
  .limit(limit);

    logger.info("Fetched products successfully");

    return {
      totalPages,
      products,
    };
  } catch (error) {
    logger.error("Failed to get products", error);
    throw error;
  }
}

}

module.exports = ProductService;

