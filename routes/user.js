const express = require("express");
const router = express.Router();

// route guard for logged user
const {loggedUserRouteGuard} = require("../middleware/routingGuard");
router.use(loggedUserRouteGuard);

// models
const Blog = require("../models/blog");
const User = require("../models/user");

// route for logged user to manage his profile, and see other data
router.route("/profile")
.get(async (req, res)=> {
    const {username, email} = req.session;
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

    res.render("user/profile", {username,email, usersBlogs, recievedComments, leftComments})
})


// route for other logged users to see user who left comment or blog, stats
router.route("/:username/profile")
.get(async (req, res)=> {
    const {username} = req.params;
    // get all blogs
    const blogs = await Blog.find().populate("author").populate("comments");
    // get user data
    const user = await User.findOne({username: username});
    
    
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
    res.render("user/user", {username, usersBlogs, recievedComments, leftComments})
})

module.exports = router;