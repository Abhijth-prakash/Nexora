const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
   productCount: {
  type: Number,
  default: 0,
}
  },
  {
    timestamps: true,
  }
);


categorySchema.pre("save", function () {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
    }
});




const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
     slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

subcategorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  }

});

subcategorySchema.index(
  { category: 1, name: 1 },
  { unique: true }
);

module.exports = {
  Category: mongoose.model("Category", categorySchema),
  Subcategory: mongoose.model("Subcategory", subcategorySchema),
};

