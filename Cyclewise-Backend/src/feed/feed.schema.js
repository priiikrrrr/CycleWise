const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const feedSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxLength: 1000
    },
    imageUrl: {
      type: String,
      default: null
    },

    //like system
    likes: [{
      type: Types.ObjectId,
      ref: 'User'
    }],

    // Comments
    comments: [commentSchema],

    // Emoji reaction system
    reactions: {
      type: Map,
      of: [Types.ObjectId],
      default: {}
    }

  },
  {
    timestamps: true
  }
);

const Feed = model("Feed",feedSchema);
module.exports = Feed;