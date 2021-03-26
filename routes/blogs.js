const express = require("express");
const router = express.Router();
const catchAsync = require("../errors/catchAsync");
const AppError = require("../errors/AppError");

/* *********************
        MIDDLEWARE
************************ */
const {loggedUserRouteGuard} = require("../middleware/routingGuard");
// router.use(loggedUserRouteGuard);

/* *********************
        MODELS
************************ */
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");



/* *********************
        SEED CATEGORIES FOR SELECT/OPTION IN CREATE  NEW BLOG ROUTE
************************ */
const {categories} = require("../seed/categories");


/* *********************
        CATEGORY TITLE - recieved from header post route
************************ */
let categorieTitle = "";

/* *********************
        ADD NEW BLOG
************************ */
router.route("/new")
.get(loggedUserRouteGuard,(req, res)=> {
    res.render("blog/new", {categories})
})
.post(loggedUserRouteGuard, catchAsync(async (req, res)=> {
    const {title, categorie, blog} = req.body;
    const loggedUser = await User.findById(req.session.userId);
    if(loggedUser) {
        const newBlog = new Blog({
        categorie: categorie.toLowerCase(),
        title,
        text: blog,
        rating: [],
        author: loggedUser,
        date: new Date().toUTCString()
        })
        await newBlog.save();
        return res.redirect("/")
    } 
    res.redirect("/auth/login")
}))


/* *********************
        BLOG DETAILS
************************ */
router.route("/:blogId")
.get(catchAsync(async (req, res, next)=> {
    const {blogId} = req.params;
    const loggedUserUsername = req.session.username;

    // get data for blog
    const blog = await Blog.findById(blogId).populate("author").populate("comments");
    if(!blog) throw new AppError(404, "Meklētais blogs nav atrasts.");

    /********* DISPLAY RATING ********/
    let isRated = 0;
    // avarage blog rating
    let ratingCount = 0;
    let totalCount = 0;
    blog.rating.forEach((rate)=> {
        ratingCount += rate.rate;
        totalCount++;
   })
    let avarage = Math.round(ratingCount / totalCount);
    // get rating data if user already rated this blog
    const allRates = blog.rating;
    for(let rate = 0; rate < allRates.length; rate++ ) {
        if(allRates[rate].userId == req.session.userId) {
            isRated = allRates[rate].rate;
        } 
    } 

    /********* DISPLAY COMMENTS ********/
    const comments = blog.comments;
    res.render("blog/blog", {categorieTitle, blog, isRated, avarage, loggedUserUsername, comments})
}))
.post(catchAsync(async(req, res)=> {
    const {blogId} = req.params; // blog id
    const {rate, comment} = req.body; // rate or comment from current logged user to current blog
    const loggedUser = await User.findById(req.session.userId); // logged user who rates current blog
    const currentBlog = await Blog.findById(blogId); // blog which rating needs to be updated

    /********* ADD RATING ***********/
    // check if user already rated this blog, if not then add rating
    if(rate) {
        const allRates = currentBlog.rating;
    for(let rate = 0; rate < allRates.length; rate++ ) {
        if(allRates[rate].userId == req.session.userId) {
            return res.redirect("/blogs/" + blogId);
        } 
    } 
    currentBlog.rating.push({
        _id: false,
        userId: loggedUser._id,
        rate
    })
    await currentBlog.save();
    }

    /********* ADD COMMENT ***********/

    if(comment){
        const newComment = new Comment({
            author: loggedUser.username,
            text: comment,
            date: new Date().toUTCString(),
            blog: {
                title: currentBlog.title,
                id: currentBlog._id,
                categorie: currentBlog.categorie
            }
        })
        await newComment.save();
        currentBlog.comments.push(newComment);
        await currentBlog.save();
    }
    res.redirect("/blogs/" + blogId);
}))


/* *********************
        ALL BLOGS IN CATEGORY
************************ */
router.route("/")
.get(catchAsync(async (req, res)=> {
    // get all blogs for current categorie
    const allBlogsForCategory = await Blog.find({categorie:categorieTitle}).populate("author").populate("comments");
    // get all comments for current categorie
    const allCommentsForCategorie = await Comment.find({"blog.categorie": categorieTitle});

    // map all categorie blogs
    const categorieBlogs = allBlogsForCategory.map((blog)=> {
        // avarage blog rating
        let ratingTotal = 0;
        let countTotal = 0;
        blog.rating.forEach((rate)=> {
            ratingTotal += rate.rate;
            countTotal++;
        })
        return {
        id: blog._id,
        title: blog.title,
        categorie: blog.categorie.toUpperCase(),
        text: blog.text,
        author: blog.author.username,
        date: blog.date,
        rating: Math.round(ratingTotal / countTotal),
        commentsLength: blog.comments.length
        }
    })
    res.render("blog/blogs", {categorieTitle, categorieBlogs, allCommentsForCategorie})
}))
.post((req, res)=> {
    categorieTitle = req.body.categorieTitle;
    res.redirect("/blogs");
})



module.exports = router;
