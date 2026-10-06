const Admin = require("../models/Admin");
const {Category,Subcategory} = require('../models/Category')
const logger = require("../utils/logger");
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
  OTPError,
} = require("../utils/errors");
const config = require('../config/config');
const { notFound } = require("../middilewares/errorHandler");

class CategoryService {

    //addingcategory
static async addCategory(data) {
    try {
        const existingCategory = await Category.findOne({
            name: data.name
        });

        // Category already exists
        if (existingCategory) {

            const existingSubCategory = await Subcategory.findOne({
                name: data.subCategory,
                category: existingCategory._id
            });

            if (!existingSubCategory) {

                const newSubCategory = new Subcategory({
                    name: data.subCategory,
                    category: existingCategory._id
                });

                await newSubCategory.save();

                logger.info(
                    `created a new sub category ${data.subCategory}`
                );

                 return {
        type: "subcategory",
        name: newSubCategory.name
    };
            }

            throw new ConflictError("Already existing category");
        }

        // Category doesn't exist
        const newCat = new Category({
            name: data.name,
            description: data.description
        });

        await newCat.save();

        if (data.subCategory) {

            const newSub = new Subcategory({
                name: data.subCategory,
                category: newCat._id
            });

            await newSub.save();
        }

        logger.info(`created a new category ${data.name}`);

       return {
    type: "category",
    name: newCat.name
};

    } catch (error) {

        logger.error("failed to add category", error);
        throw error;
    }
}


//getting all categories

static async getcategories(){
    try{
    const categories = await Category.find()
    if(!categories){
        throw new NotFoundError('failed to get categories')
    }
    logger.info('succefully fetched all categories')
    return categories
    }catch(error){
        logger.error('failed to get categories',error);
        throw error
    }
    
}


//get category by id

static async getCategory(id) {
    try {
        const category = await Category.findById(id);

        if (!category) {
            throw new NotFoundError("category not found");
        }

        const subCategories = await Subcategory.find({
            category: category._id
        });

        logger.info("successfully fetched category");

        return {
            category,
            subCategories
        };

    } catch (error) {
        logger.error("failed to get category", error);
        throw error;
    }
}


// delete category
static async deleteCategory(id) {
  try {
    const uncategorisedId = config.UncategorisedId;

    await Subcategory.updateMany(
      { category: id },
      {
        $set: {
          category: uncategorisedId
        }
      }
    );

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundError("category not found");
    }

    logger.info("successfully deleted category");

    return true;

  } catch (error) {
    logger.error("failed to delete category", error);
    throw error;
  }
}


//update category

static async UpdateCategory(data, id) {
    try {
        const category = await Category.findById(id)

        if (!category) {
            throw new NotFoundError("category not found")
        }

        await Category.updateOne(
            { _id: id },
            {
                $set: {
                    name: data.name,
                    description: data.description
                }
            }
        )

        if (data.subCategory) {

            const subcategory = await Subcategory.findOne({name:data.subCategory})
            if(!subcategory){
                const newSub = new Subcategory({
                name: data.subCategory,
                category: id
            })

            await newSub.save()
            }
          
        }

        logger.info(`${data.name} updated successfully`)

        return true

    } catch (error) {
        logger.error("failed to update category", error)
        throw error
    }
} 

}



module.exports = CategoryService