const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
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
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    googleId: {
    type: String,
    unique: true,
    sparse: true
}
  },
  
  {
    timestamps: true,
  }
);


// INDEXES

UserSchema.index({ createdAt: -1 });


// PASSWORD HASHING

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  try {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    this.password = hashedPassword;
  } catch (error) {
    throw error;
  }
});


// COMPARE PASSWORD

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;

  return await bcrypt.compare(candidatePassword, this.password);
};


// PUBLIC PROFILE

UserSchema.methods.getProfile = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.otp;
  delete userObject.__v;
  delete userObject.otpExpiry;

  return userObject;
};


// FIND USER BY EMAIL

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase(),
  });
};


module.exports = mongoose.model("User", UserSchema);