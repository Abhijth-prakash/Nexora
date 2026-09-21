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

const customMessages = {
  "string.min": "{#label} must be at least {#limit} characters long",
  "string.max": "{#label} cannot exceed {#limit} characters",
  "string.email": "Please provide a valid email address",
  "any.required": "{#label} is required",
  "any.only": "{#label} must be one of: {#valids}",
  "string.pattern.base": "{#label} format is invalid",
};

const registerValidate = Joi.object({
  name: commonPatterns.name,
  email: commonPatterns.email,
  password: commonPatterns.password,
});

const loginValidate = Joi.object({
  email: commonPatterns.email,
 password: Joi.string()
  .min(1)
  .required()
  .messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  })  
})

const OTPValidation = Joi.object({
  email: commonPatterns.email,
  otp: commonPatterns.otp,
}).messages({
  ...customMessages,
  "string.length": "OTP must be exactly 6 digits",
  "string.pattern.base": "OTP must contain only numbers",
  "any.required": "OTP is required",
});

const EmailValidation = Joi.object({
  email:commonPatterns.email
})

const resetPassValidation = Joi.object({
  password:commonPatterns.password,
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
  })
})

const changepasswordValidation = Joi.object({
  currentpassword: Joi.string()
  .min(1)
  .required()
  .messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),  
  newpassword:commonPatterns.password
})

const AddressValidation = Joi.object({
  fullName: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 2 characters",
    }),

  phone: Joi.string()
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.min": "Phone number must be at least 10 digits",
      "string.max": "Phone number cannot exceed 15 digits",
    }),

  address: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters",
    }),

  city: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "City is required",
    }),

  state: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "State is required",
    }),

  country: Joi.string()
    .min(2)
    .required()
    .messages({
      "string.empty": "Country is required",
    }),

  zipCode: Joi.string()
    .min(4)
    .required()
    .messages({
      "string.empty": "ZIP code is required",
    }),

  type: Joi.string()
    .valid("Home", "Work", "Other")
    .required()
    .messages({
      "any.only": "Type must be Home, Work, or Other",
      "string.empty": "Address type is required",
    }),
})



module.exports = {
  registerValidate,
  OTPValidation,
  loginValidate,
  EmailValidation,
  resetPassValidation,
  AddressValidation,
  changepasswordValidation
};