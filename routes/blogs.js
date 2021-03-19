const express = require("express");
const router = express.Router();


const Blog = require("../models/blog");
const User = require("../models/user");
const {categories} = require("../seed/categories");


let categorie = "";

// to add new blog
router.route("/new")
.get((req, res)=> {
    res.render("blog/new", {categories})
})
.post(async (req, res)=> {
    const {title, categorie, blog} = req.body;
    const loggedUser = await User.findById(req.session.userId);
    if(loggedUser) {
        const newBlog = new Blog({
        categorie,
        title,
        text: blog,
        rating: 0,
        author: loggedUser,
        date: new Date()
        })
        await newBlog.save();
        res.redirect("/")
    }
    res.redirect("/auth/login")
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
