const { param } = require("express-validator");

const userFeedValidator = [
    param("username")
    .notEmpty().withMessage("Username is required")
    .isString().withMessage("Username must be a string")
    .isLength({min:3}).withMessage("Username is invalid")
];

module.exports = userFeedValidator;