const express = require("express");
const router = express.Router();

// MODELS 
const Blog = require("../models/blog");


router.route("/")
.get(async (req, res)=> {
    // all blogs in db
    const blogs = await Blog.find({});
    // top 5 blogs depending on rating (now for simplicity only 5 casual blogs)
    const top5blogs = blogs.slice(0,5);
    console.log(req.session.userId, req.session.logged_username)
    res.render("home", {blogs, top5blogs});
})





module.exports = router;