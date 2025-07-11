const { Schema, model, Types } = require("mongoose");

// const symptomSchema = new Schema(
//     {
//   symptom: {
//     type: String,
//     enum: ["bloated", "high", "sad", "happy", "content", "depressed", "dizzy", "weak"]
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, { _id: false });

const cycleSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            ref: "User"
        },
        periodStartDate: {
            type: Date,
            required: true
        },
        periodEndDate: {
            type: Date,
            required: false
        },
        symptoms: {
            type: [String],
            enum: ["bloated", "high", "sad", "happy", "content", "depressed", "dizzy", "weak"],
            default: []
        },
        // cycleLength: {
        //     type: Number, //days
        //     default: null
        // },
        // periodLength: {
        //     type: Number, //days
        //     default: null
        // },
        systemCalculations: {
            cycleLength: Number,
            periodLength: Number,
            avgCycleLength: Number
        },
        predictionLogic: {
            nextPeriod: Date,
            ovulationDay: Date,
            fertilityWindow: {
                start: Date,
                end: Date
            }
        }       

    }, { timestamps: true }
);

const Cycle = model("Cycle", cycleSchema);
module.exports = Cycle;