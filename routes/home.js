const express = require("express");
const router = express.Router();

// MODELS 
const Blog = require("../models/blog");


router.route("/")
.get(async (req, res)=> {
    // all blogs in db
    const blogs = await Blog.find({}).populate("author");

    const latestBlogs = blogs.map((blog)=> {
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

    // range all blogs from top rated to low rated descent
    let sortedBlogsRatings = latestBlogs.map((blog)=> {
        return {
            id: blog.id,
            title: blog.title,
            categorie: blog.categorie,
            text: blog.text,
            rating: blog.rating ? blog.rating : 0
        }
    });

    // top 5 blogs depending on rating (now for simplicity only 5 casual blogs)
    const top5blogs = blogs.slice(0,5);

    
    res.render("home", {latestBlogs, top5blogs});
})





module.exports = router;