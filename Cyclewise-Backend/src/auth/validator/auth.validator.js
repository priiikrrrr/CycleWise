const {body} = require("express-validator");
const authValidator = [
    body("email").isEmail().notEmpty().trim(),
    body("password").isLength({min:8}).isString(),
]
module.exports = authValidator;