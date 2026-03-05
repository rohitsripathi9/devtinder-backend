const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[A-Za-z]+$/)
      .min(2)
      .max(30)
      .required()
      .messages({
        "string.empty": "First name is required",
        "string.pattern.base": "First name must contain only letters",
        "string.min": "First name must be at least 2 characters",
        "string.max": "First name cannot exceed 30 characters",
      }),

    lastName: Joi.string()
      .pattern(/^[A-Za-z]*$/)
      .max(30)
      .allow('', null)  // Added this - allows empty lastName
      .messages({
        "string.pattern.base": "Last name must contain only letters",
        "string.max": "Last name cannot exceed 30 characters",
      }),

    emailId: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email ID is required",
        "string.email": "Invalid email format",
      }),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must include uppercase, lowercase, number, and special character",
      }),

    age: Joi.number().min(10).max(100).messages({
      "number.min": "Age must be at least 10",
      "number.max": "Age cannot exceed 100",
    }),

    gender: Joi.string()
      .valid("male", "female", "other")
      .insensitive()
      .messages({
        "any.only": "Gender must be male, female, or other",
      }),

    skills: Joi.array()
      .items(Joi.string().trim().min(1).messages({
        "string.empty": "Each skill must be a non-empty string",
      }))
      .default([]),
  }).options({ stripUnknown: true }); // Added this - removes extra fields

  return schema.validate(data, { abortEarly: false });
};

const profileEditValidation = (req) => {
  const allowedEditFields = ["firstName","lastName","gender","age","about","skills","photoUrl"];
  
  // Check if all fields in req.body are allowed
  const isValid = Object.keys(req.body).every((key) => allowedEditFields.includes(key));
  
  return isValid;
};



module.exports = { registerValidation ,profileEditValidation};