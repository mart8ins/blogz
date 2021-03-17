const express = require("express");
const router = express.Router();

const Blog = require("../models/blog");


let categorie = "";

// to add new blog
router.route("/new")
.get((req, res)=> {
    res.render("blog/new")
})

// specific blog route
router.route("/:blogId")
.get(async (req, res)=> {
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId)
    res.render("blog/blog", {categorie, blog})
})

// all blogs for each category route
router.route("/")
.get(async (req, res)=> {
    const allBlogsForCategory = await Blog.find({categorie:categorie});
    res.render("blog/blogs", {categorie, allBlogsForCategory})
})
.post((req, res)=> {
categorie = req.body.categorie;
    res.redirect("/blogs");
})



module.exports = router;
