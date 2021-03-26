const express = require("express");
const AppError = require("../errors/AppError");
const router = express.Router();
const catchAsync = require("../errors/catchAsync");

// MODELS 
const Blog = require("../models/blog");
const Comment = require("../models/comment");


router.route("/")
    .get(catchAsync(async (req, res) => {
        // all blogs in db
        const blogs = await Blog.find({}).populate("author").populate("comments");
        if(!blogs) throw AppError(404, "Blogi nav atrasti");
        // all comments in db
        const commentsAll = await Comment.find({});
        const latest5comments = commentsAll.reverse().slice(0, 5);

        // all blo
        const latestBlogs = blogs.map((blog) => {
            // avarage blog rating
            let ratingTotal = 0;
            let countTotal = 0;
            blog.rating.forEach((rate) => {
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

        // top 5 blogs depending on rating, minimum rating 3 (5 latest with best rating)
        let top5blogs = [];
        for (let blog of latestBlogs.reverse()) {
            if (blog.rating == 5 && top5blogs.length != 5) {
                top5blogs.push(blog)
            } else if (blog.rating == 4 && top5blogs.length != 5) {
                top5blogs.push(blog)
            } else if (blog.rating == 3 && top5blogs.length != 5) {
                top5blogs.push(blog)
            }
        }

        res.render("home", {
            latestBlogs,
            top5blogs,
            latest5comments
        });
    }))

module.exports = router;