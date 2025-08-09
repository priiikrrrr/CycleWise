const {body, param} = require("express-validator");

const cycleValidator = [
    body("periodStartDate")
    .notEmpty().isDate().withMessage("enter valid format"),
    body("periodEndDate")
    .notEmpty().optional().isDate().withMessage("enter valid format"),
    body("symptoms")
    .optional()
    .isArray().withMessage("Symptoms must be an array of strings")
    .custom((symptoms) => {
      const allowed = ["bloated", "high", "sad", "happy", "content", "depressed", "dizzy", "weak"];
      return symptoms.every(symptom => allowed.includes(symptom));
    }).withMessage("One or more symptoms are not valid"),
];

module.exports = cycleValidator;