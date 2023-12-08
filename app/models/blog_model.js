const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authorid: {
    type: String,
    required: true,
  },
  authorImage: {
    type: String,
  },
  authorName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: [
    {
      userImage: {
        type: String,
      },
      username: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      commentText: {
        type: String,
        required: true,
      },
    },
  ],
  tag: {
    type: String,
  },
  publishDate: {
    type: String,
    required: true,
  },
  readtime: {
    type: Number,
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
