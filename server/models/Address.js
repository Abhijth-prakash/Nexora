const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    zipCode: {
      type: String,
      required: [true, "Zip code is required"],
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Find all addresses belonging to a user
addressSchema.index({ user: 1 });

// Useful for finding default addresses
addressSchema.index({ isDefault: 1 });

// If this address becomes default,
// remove default status from other addresses of the same user.
addressSchema.pre("save", async function () {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose.model("Address").updateMany(
      {
        user: this.user,
        _id: { $ne: this._id },
      },
      {
        $set: { isDefault: false },
      }
    );
  }
});

module.exports = mongoose.model("Address", addressSchema);