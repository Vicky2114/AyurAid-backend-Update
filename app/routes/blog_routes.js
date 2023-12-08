const express = require("express");
const auth_controller = require("../controllers/auth_controller.js");
const blog_controller = require("../controllers/blog_controller.js");

const router = express.Router();

router.use(auth_controller.protect);

router.get("/allBlogs", blog_controller.allBlogs); //All blogs sorted by likes

router.post("/addBlog", blog_controller.addBlog);



router.get("/blog/:id", blog_controller.blogById); //Particular Blog
router.get("/blogs", blog_controller.blogs); //Blog of logedIn user
router.get("/search/title?", blog_controller.searchTitle);
router.get("/filter/:tag", blog_controller.filterTag);


router.patch("/like/:id", blog_controller.likeBlog);
router.patch("/unlike/:id", blog_controller.unlikeBlog);
router.patch("/comment/:id", blog_controller.addComment);
router.patch("/bookmarks/:id", blog_controller.bookmark);
router.patch("/unbookmark/:id", blog_controller.unbookmark);
router.patch("/updateBlog/:id", blog_controller.updateBlog);

router.delete("/delete/:id", blog_controller.deleteBlog);
router.delete("/deleteComment/:blogId/:commentId", blog_controller.deleteComment);

module.exports = router;
