const User = require("../models/user_model");
const Blog = require("../models/blog_model");
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

exports.addBlog = async (req, res) => {
  const date =
    new Date().getDate() +
    " " +
    monthNames[new Date().getMonth()] +
    " " +
    new Date().getFullYear();
  const { title, image, description, tag } = req.body;

  const authorid = req.user._id;
  const author = await User.findById(authorid);

  const charCount = description.length;
  const readtime = charCount > 1000 ? charCount / 1000 : 1;

  const newBlog = await Blog.create({
    title: title,
    authorid: authorid,
    authorImage: author.profileImage,
    authorName: author.username,
    image: image,
    description: description,
    tag: tag.toLowerCase(),
    readtime: readtime,
    publishDate: date,
  });

  return res.status(200).json({
    status: "success",
    data: {
      title: newBlog.title,
      id: newBlog._id,
    },
  });
};

exports.allBlogs = async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ likes: -1, updatedAt: 1 });

  return res.status(201).json({
    status: "success",
    data: {
      allBlogs,
    },
  });
};
exports.userInfo = async (req, res) => {
  const user = await User.findById(req.user._id);

  return res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.blogById = async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Not found",
      },
    });
  }

  return res.status(201).json({
    status: "success",
    data: {
      blog,
    },
  });
};

exports.blogs = async (req, res) => {
  const authorid = req.user._id;

  const blogs = await Blog.find({ authorid: authorid });

  return res.status(201).json({
    status: "success",
    data: {
      blogs,
    },
  });
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  await Blog.deleteOne({ _id: id });

  return res.status(201).json({
    status: "success",
    data: {
      message: "Blog Deleted",
    },
  });
};

exports.likeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Not found",
      },
    });
  }

  if (!blog.likes.includes(userId)) {
    await blog.updateOne({ $push: { likes: userId } });
    return res.status(201).json({
      status: "success",
      data: {
        message: "Liked",
      },
    });
  } else {
    return res.status(201).json({
      status: "success",
      data: {
        message: "Already Liked",
      },
    });
  }
};

exports.unlikeBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Not found",
      },
    });
  }

  if (blog.likes.includes(userId)) {
    await blog.updateOne({ $pull: { likes: userId } });
    return res.status(201).json({
      status: "success",
      data: {
        message: "Unliked",
      },
    });
  } else {
    return res.status(201).json({
      status: "success",
      data: {
        message: "You never liked it",
      },
    });
  }
};

exports.bookmark = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "User Not found",
      },
    });
  }
  let flag = 0;
  const allBookmarks = await user.bookmarks;
  allBookmarks.map((b) => {
    if (b.blogId == id) {
      flag = 1;
    }
  });
  if (!flag) {
    await user.updateOne({ $push: { bookmarks: { blogId: id } } });
    return res.status(201).json({
      status: "success",
      data: {
        message: "Bookemarked",
      },
    });
  } else {
    return res.status(201).json({
      status: "success",
      data: {
        message: "You already bookmarked it",
      },
    });
  }
};

exports.unbookmark = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await User.findById({ _id: userId });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "User Not found",
      },
    });
  }

  let flag = 0;
  const allBookmarks = await user.bookmarks;
  allBookmarks.map((b) => {
    if (b.blogId == id) {
      flag = 1;
    }
  });
  if (flag) {
    await user.updateOne({ $pull: { bookmarks: { blogId: id } } });
    return res.status(201).json({
      status: "success",
      data: {
        message: "Unbookemarked",
      },
    });
  } else {
    return res.status(201).json({
      status: "success",
      data: {
        message: "You never bookmarked it",
      },
    });
  }
};

exports.filterTag = async (req, res) => {
  const { tag } = req.params;

  const blogs = await Blog.find({ tag: tag.toLowerCase() });

  return res.status(201).json({
    status: "success",
    data: {
      blogs,
    },
  });
};

exports.searchTitle = async (req, res) => {
  const { titleRec } = req.params;

  const blogs = await Blog.find({
    title: { $regex: titleRec, $options: "i" },
  });

  return res.status(201).json({
    status: "success",
    data: {
      blogs,
    },
  });
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const date =
    new Date().getDate() +
    " " +
    monthNames[new Date().getMonth() + 1] +
    " " +
    new Date().getFullYear();
  const { title, image, description, category } = req.body;

  let charCount;
  let readtime;
  if (description) {
    charCount = description.length;
    readtime = charCount > 1000 ? charCount / 1000 : 1;
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Not found",
      },
    });
  }

  const data = {
    title: title,
    image: image,
    description: description,
    category: category,
    readtime: readtime,
    publishDate: "Edited " + date,
  };

  if (blog.authorid != req.user._id) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Not authorized",
      },
    });
  }

  await Blog.findByIdAndUpdate(id, { $set: data });

  return res.status(201).json({
    status: "success",
    data: {
      blogId: blog._id,
      title: data.title,
    },
  });
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { commentText } = req.body;

  const blog = await Blog.findById(id);
  const user = await User.findById(userId);

  if (!blog) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Blog Not found",
      },
    });
  }

  await blog.updateOne({
    $push: {
      comments: {
        userId: user._id,
        username: user.username,
        userImage: user.profileImage,
        commentText: commentText,
      },
    },
  });

  return res.status(201).json({
    status: "success",
    data: {
      message: "Comment added",
    },
  });
};

exports.deleteComment = async (req, res) => {
  const { blogId, commentId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Not found",
      },
    });
  }
  const allComments = blog.comments;

  let flag = 0;
  allComments.map(async (c) => {
    if (c.userId == req.user._id && c._id == commentId) {
      flag = 1;
      await blog.updateOne({ $pull: { comments: { _id: c._id } } });
      return res.status(201).json({
        status: "success",
        data: {
          message: "Comment deleted",
        },
      });
    }
  });

  if (!flag) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Comment not deleted",
      },
    });
  }
};
