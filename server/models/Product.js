const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema(
  {
    color: { type: String, trim: true, lowercase: true },

    size: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    // Cached average, updated by Review.recalculateProductRating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    public_ids: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    color: { type: String, trim: true, lowercase: true },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    visible: {
      type: Boolean,
      default: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    size: {
      type: [String],
      default: [],
    },

    // Cached summary, updated by Review.recalculateProductRating.
    // Don't set these manually.
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    variants: {
      type: [VariantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.index({ category: 1, visible: 1, createdAt: -1 });
ProductSchema.index({ subCategory: 1, visible: 1, createdAt: -1 });

// Virtual link to the Review collection (nothing stored on the product)
ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

// Populate category and subcategory details
ProductSchema.methods.populateDetails = async function () {
  await this.populate([
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
  ]);

  return this;
};

// Fetch products excluding the "Uncategorised" category
ProductSchema.statics.getCategorisedProducts = async function () {
  return this.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $match: {
        "categoryDetails.name": {
          $ne: "Uncategorised",
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subCategory",
        foreignField: "_id",
        as: "subCategoryDetails",
      },
    },
    {
      $unwind: {
        path: "$categoryDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$subCategoryDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
};

module.exports = mongoose.model("Product", ProductSchema);