const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ['farmer', 'admin', 'expert'], default: 'farmer' },
    content: { type: String, required: true },
    isExpertAnswer: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: { type: String, required: true },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Crop Diseases', 'Soil & Fertilizers', 'Pest Control', 'Irrigation Tech', 'Market Trends', 'Government Schemes'],
      default: 'Crop Diseases',
    },
    cropTag: {
      type: String,
      default: 'General',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'Expert Answered', 'Resolved'],
      default: 'Open',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ForumPost', forumPostSchema);
