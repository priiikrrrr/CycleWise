const {body,param} = require("express-validator");

const commentValidator = [
    param("feedId", "Feed Id must be a valid mongoId").isMongoId(),
    body("text").notEmpty().withMessage("Comment text is required").isLength({max:500}).withMessage("comment length mustn't exceed 500 characters!")

];

module.exports = commentValidator;