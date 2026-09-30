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


class CategoryService {

    //addingcategory
   static async addCategory(data) {
    try {

        const existingCategory = await Category.findOne({
            name: data.name
        });

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
            }

            throw new ConflictError("Already existing category");
        }

        const newCat = new Category({
            name: data.name,
            description: data.description
        });

        await newCat.save();

        logger.info(`created a new category ${data.name}`);

        return {
            name: newCat.name,
            description: newCat.description,
            productCount: newCat.productCount,
            isVisible: newCat.isVisible
        };

    } catch (error) {

        logger.error("failed to add category", error);
        throw error;
    }
}


}



module.exports = CategoryService