const express = require("express");
const router = express.Router();

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
.post(loggedUserRouteGuard, async (req, res)=> {
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
        res.redirect("/")
    }
    res.redirect("/auth/login")
})


/* *********************
        BLOG DETAILS
************************ */
router.route("/:blogId")
.get(async (req, res)=> {
    const {blogId} = req.params;
    let isRated = 0;

    // get data for blog
    const blog = await Blog.findById(blogId).populate("author");

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
    res.render("blog/blog", {categorieTitle, blog, isRated, avarage})
})
.post(async(req, res)=> {
    const {blogId} = req.params; // blog id
    const {rate} = req.body; // rate from current logged user to current blog
    const loggedUser = await User.findById(req.session.userId); // logged user who rates current blog
    const updateBlogsRating = await Blog.findById(blogId); // blog which rating needs to be updated

    // check if user already rated this blog, if not then add rating
    const allRates = updateBlogsRating.rating;
    for(let rate = 0; rate < allRates.length; rate++ ) {
        if(allRates[rate].userId == req.session.userId) {
            console.log("Blog already rated");
            return res.redirect("/blogs/" + blogId);
        } 
    } 
    updateBlogsRating.rating.push({
        _id: false,
        userId: loggedUser._id,
        rate
    })
    await updateBlogsRating.save();
    res.redirect("/blogs/" + blogId);
    
})


/* *********************
        ALL BLOGS IN CATEGORY
************************ */
router.route("/")
.get(async (req, res)=> {
    const allBlogsForCategory = await Blog.find({categorie:categorieTitle}).populate("author");

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
        rating: Math.round(ratingTotal / countTotal)
        }
    })


    res.render("blog/blogs", {categorieTitle, categorieBlogs})
})
.post((req, res)=> {
    categorieTitle = req.body.categorieTitle;
    res.redirect("/blogs");
})



module.exports = router;
