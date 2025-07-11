const {body,param} = require("express-validator");

const reactValidator = [
    param("feedId")
    .notEmpty().withMessage("FeedId required")
    .isMongoId().withMessage("Feed Id must be valid mongo id"),
    body("emoji")
    .notEmpty().withMessage("Emoji type is required")
    .isString().withMessage("Emoji must be a string")
];

module.exports = reactValidator;