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
const {uploadFile,destroyFile} = require('../config/cloudinary');
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
            color:data.color,
            brand:data.brand,
            rating:data.rating
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
static async getProducts(page, search, sort, filter) {
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

    // Category filter
    if (filter) {
      query.category = filter;
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


//get product by id

static async getProductByid(id) {
  try {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return await product.populateDetails();
  } catch (error) {
    logger.error('failed to get product',error)
    throw error;
  }
}

//add Vairant

static async addVariant(id, data, files = []) {
  try {
    const { color, size = [], price, stock, rating } = data;

    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const normalizedColor = color?.toLowerCase().trim();

    if (normalizedColor && product.variants.some(v => v.color === normalizedColor)) {
      throw new ConflictError("Color already exists");
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await uploadFile(file.path);

        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

    const images = uploadedImages.map((image) => image.url);
    const public_ids = uploadedImages.map((image) => image.public_id);

    product.variants.push({
      color: normalizedColor,
      size,
      price,
      stock,
      images,
      public_ids,
      rating,
    });

    product.stock = product.variants.reduce(
      (sum, v) => sum + (v.stock || 0),
      0
    );

    await product.save();

    logger.info(`New variant for ${product.name} added successfully`);

    return null;
  } catch (error) {
    logger.error('failed to add variant', error);
    throw error;
  }
}

//delete variant 

static async deleteVariant(id, variantId) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      throw new NotFoundError("Variant not found");
    }

    const publicIdsToDelete = [...(variant.public_ids || [])];

    variant.deleteOne();

    if (product.variants.length) {
      product.stock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }

    await product.save();

    await Promise.all(
      publicIdsToDelete.map((publicId) => destroyFile(publicId))
    );

    logger.info(`Variant ${variantId} deleted from ${product.name}`);

    return null;
  } catch (error) {
    logger.error("failed to delete variant", error);
    throw error;
  }
}


}

module.exports = ProductService;

