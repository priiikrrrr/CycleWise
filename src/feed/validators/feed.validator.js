const {body} = require("express-validator");

const feedValidator = [
    body("content")
    .notEmpty().withMessage("content cannot be empty")
    .isString().withMessage("content must be a string")
    .isLength({max:1000}).withMessage("content limit exceeded."),
    body("imageUrl")
    .optional()
    .isString().withMessage("provide the correct url of image"),
];

module.exports = feedValidator;