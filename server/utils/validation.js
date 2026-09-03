const Joi = require("joi");

const commonPatterns = {
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
      "any.required": "Name is required",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least {#limit} characters",
      "string.max": "Password cannot exceed {#limit} characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),

  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid ID",
    }),

  status: Joi.string()
    .valid("active", "banned", "inactive")
    .messages({
      "any.only": "Status must be active, banned, or inactive",
    }),

  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.pattern.base": "OTP must be exactly 6 digits",
      "any.required": "OTP is required",
    }),
};

const registerValidate = Joi.object({
  name: commonPatterns.name,
  email: commonPatterns.email,
  password: commonPatterns.password,
});

module.exports = {
  registerValidate,
};