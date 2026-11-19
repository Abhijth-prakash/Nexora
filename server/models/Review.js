const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

// One review per user per variant (variant null = whole-product review)
ReviewSchema.index({ product: 1, variant: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ product: 1, variant: 1, createdAt: -1 });

ReviewSchema.statics.recalculateProductRating = async function (
  productId,
  variantId = null
) {
  const pid = new mongoose.Types.ObjectId(productId);
  const Product = mongoose.model("Product");

  // Product-level rating: all reviews for the product, variants included
  const [productStats] = await this.aggregate([
    { $match: { product: pid } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(pid, {
    rating: productStats ? Math.round(productStats.avg * 10) / 10 : 0,
    numReviews: productStats ? productStats.count : 0,
  });

  // Variant-level rating
  if (variantId) {
    const vid = new mongoose.Types.ObjectId(variantId);
    const [variantStats] = await this.aggregate([
      { $match: { product: pid, variant: vid } },
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);

    await Product.updateOne(
      { _id: pid, "variants._id": vid },
      {
        $set: {
          "variants.$.rating": variantStats
            ? Math.round(variantStats.avg * 10) / 10
            : 0,
        },
      }
    );
  }
};

ReviewSchema.post("save", function () {
  return this.constructor.recalculateProductRating(this.product, this.variant);
});

ReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc)
    return doc.constructor.recalculateProductRating(doc.product, doc.variant);
});

ReviewSchema.post("findOneAndUpdate", function (doc) {
  if (doc)
    return doc.constructor.recalculateProductRating(doc.product, doc.variant);
});

module.exports = mongoose.model("Review", ReviewSchema);