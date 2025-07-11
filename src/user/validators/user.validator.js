// user.validator.js
const { body } = require("express-validator");

const createUserValidator = [
  body("firstName")
    .notEmpty().withMessage("First name is required")
    .isString().withMessage("First name must be a string")
    .isLength({ max: 100 }).withMessage("Max 100 characters allowed")
    .trim(),

  body("lastName")
    .optional()
    .isString().withMessage("Last name must be a string")
    .isLength({ max: 100 }).withMessage("Max 100 characters allowed")
    .trim(),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .isLength({ max: 200 }).withMessage("Max 200 characters allowed")
    .trim(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Must be at least 8 characters"),

  body("username")
    .notEmpty().withMessage("Username is required")
    .isString().withMessage("Username must be a string")
    .isLength({ min: 3, max: 30 }).withMessage("Must be 3-30 characters")
    .trim()
    .toLowerCase(),

  body("privacyMode")
    .optional()
    .isBoolean().withMessage("Privacy mode must be true or false"),

  body("avatarUrl")
    .optional()
    .isString().withMessage("Avatar URL must be a string")
    .trim(),

  body("bio")
    .optional()
    .isString().withMessage("Bio must be a string")
    .isLength({ max: 100 }).withMessage("Max 100 characters allowed"),
];



module.exports = createUserValidator;
