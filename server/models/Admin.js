const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true,
  },
);

AdminSchema.index({ lastLogin: -1 });

AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
  } catch (error) {
    throw error;
  }
});

AdminSchema.methods.getPublicProfile = function () {
  const adminObject = this.toObject();
  delete adminObject.password;
  delete adminObject.__v;
  return adminObject;
};

AdminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

AdminSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model("Admin", AdminSchema);