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

static async getcategories(page, search, filter) {
    try {
        const currentPage = page || 1
        const limit = 8
        const skip = (currentPage - 1) * limit

        const query = {}

        
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]
        }

        // Filter
        if (filter) {

            if (filter === "visible") {
                query.isVisible = true
            }

            if (filter === "notvisible") {
                query.isVisible = false
            }
        }

       
        const totalCategries = await Category.countDocuments(query)

        // Total pages
        const totalPages = Math.ceil(
            totalCategries / limit
        )

        
        const categories = await Category
            .find(query)
            .skip(skip)
            .limit(limit)

        logger.info("Successfully fetched all categories")

        return {
            categories,
            totalCategries,
            totalPages
        }

    } catch (error) {

        logger.error(
            "Failed to get categories",
            error
        )

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


static async deleteCategory(id) {
  try {
    const uncategorisedId = config.UncategorisedId;

    if (String(id) === String(uncategorisedId)) {
      throw new AuthorizationError("Uncategorised category cannot be deleted");
    }

   
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("category not found");
    }

    const subs = await Subcategory.find({ category: id });

    for (const sub of subs) {
      
      let name = sub.name;
      let n = 0;
      while (await Subcategory.exists({ category: uncategorisedId, name })) {
        n++;
        name =
          n === 1
            ? `${sub.name} (${category.name})`
            : `${sub.name} (${category.name} ${n})`;
      }

      sub.name = name;
      sub.category = uncategorisedId;
      await sub.save();
    }

    await category.deleteOne();

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
    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError("category not found");
    }

    if (data.name !== undefined) category.name = data.name;
    if (data.description !== undefined) category.description = data.description;

    await category.save(); 

    if (data.subCategory) {
      const exists = await Subcategory.exists({
        name: data.subCategory,
        category: id,
      });

      if (!exists) {
        await Subcategory.create({
          name: data.subCategory,
          category: id,
        });
      }
    }

    logger.info(`${category.name} updated successfully`);
    return true;
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError("a category with this name already exists");
    }
    logger.error("failed to update category", error);
    throw error;
  }
}


//visibility

static async hideCategory(id){
    try{
        const category = await Category.findById(id)
        if(!category){
           throw new NotFoundError('category not found')
        }

        category.isVisible = false
        await category.save()

        logger.info('succesfully hide the category')
        return true
    }catch(error){
        logger.error('failed to hide category',error)
        throw error
    }
}

static async unHidecategory(id){
    try{
        const uncategorisedId = config.UncategorisedId;

    if (String(id) === String(uncategorisedId)) {
      throw new AuthorizationError(
    "The Uncategorised category must remain hidden."
);
    }
 
        const category = await Category.findById(id)
        if(!category){
           throw new NotFoundError('category not found')
        }

        category.isVisible = true
        await category.save()

        logger.info('succesfully unhide the category')
        return true

    }catch(error){
        logger.error('failed to unhide category',error)
        throw error
    }
}

//delete subcategory

static async deleteSubcategory(id, subId) {
    try {

        const deleteSUb = await Subcategory.deleteOne({
            _id: subId,
            category: id
        });

        if (deleteSUb.deletedCount === 0) {
            throw new NotFoundError("subcategory not found");
        }

        logger.info("subcategory deleted successfully");

        return true;

    } catch (error) {
        logger.error("failed to delete subcategory", error);
        throw error;
    }
}

}



module.exports = CategoryService