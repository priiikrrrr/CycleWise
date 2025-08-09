const { body } = require("express-validator");

const ChatValidator = [
  body("message")
    .notEmpty().withMessage("Message cannot be empty")
    .isLength({ max: 500 }).withMessage("Message too long"),

  body("receiverUsername")
    .notEmpty().withMessage("Receiver username is required")
    .isString().withMessage("Must be a string"),
];

module.exports = ChatValidator;