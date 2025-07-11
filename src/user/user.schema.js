const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
      trim: true,
      maxLength: [100, "Length of first name should be under 100 characters"],
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      maxLength: [100, "Length of last name should be under 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          // simpler regex that just checks for an @ and a dot after it
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: () => `please enter a valid email address`,
      },
    },

    password: {
      type: String,
      required: [true, "Password is required!"],
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    privacyMode: {
      type: Boolean,
      default: false, // false = public profile
    },
    avatarUrl: {
      type: String,
      required: false,
      trim: true,
    },
    bio: {
      type: String,
      required: false,
      maxLength: [100, "Length of bio should be under 100 characters"],
    },
  },
  {
    timestamps: true, //adds CreatedAt and UpdatedAt automatically
  }
);

const User = model("User", userSchema);

module.exports = User;
