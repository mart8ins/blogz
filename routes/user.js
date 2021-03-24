const express = require("express");
const router = express.Router();

// route guard for logged user
const {loggedUserRouteGuard} = require("../middleware/routingGuard");
router.use(loggedUserRouteGuard);

// models
const Blog = require("../models/blog");

// route for logged user to manage his profile, and see other data
router.route("/profile")
.get(async (req, res)=> {
    const {userId,username} = req.session;
    // get all blogs
    const blogs = await Blog.find().populate("author").populate("comments");
    // to store users blogs
    const usersBlogs = [];
    // to store recieved comments for users blogs
    const recievedComments = [];
    // store users left comments
    const leftComments = [];

    blogs.forEach((blog)=> {
        // to filter users blogs and recieved comments
        if(blog.author.username == username) {
            usersBlogs.push(blog);
            if(blog.comments.length){
                blog.comments.forEach((comment)=> {
                    recievedComments.push(comment)
                })
            }
        }
        // to get all left by user comments
        if(blog.comments.length){
            blog.comments.forEach((comment)=> {
                if(comment.author == username){
                    leftComments.push(comment)
                }
            })
        }
    })
    res.render("user/profile", {username, usersBlogs, recievedComments, leftComments})
})

// route for other logged users to see user who left comment or blog, stats
router.route("/:username/profile")
.get((req, res)=> {
    res.render("user/userData")
})

module.exports = router;