const { body } = require("express-validator");

const moodValidator = [
    body("mood")
    .notEmpty()
    .isArray({min : 1}).withMessage("At least one mood is required")
    .custom((mood) => {
      const allowed = ["happy", "sad", "angry", "calm", "anxious", "depressed", "neutral", "excited"]
      return mood.every(mood => allowed.includes(mood));
    }).withMessage("One or more mood are not valid"),
    body("note")
    .optional()
    .isString().withMessage("The note must be in string format")
    .isLength({max : 500}).withMessage("character limit exceeded: 500char max")
];

module.exports = moodValidator;