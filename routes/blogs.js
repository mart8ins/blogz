const express = require("express");
const router = express.Router();

let categorie = "";


router.route("/blogs/:blogId")
.get((req, res)=> {
    const {blogId} = req.params;
    res.render("blog/blog", {categorie, blogId})
})

router.route("/blogs")
.get((req, res)=> {
    res.render("blog/blogs", {categorie})
})
.post((req, res)=> {
categorie = req.body.categorie;
    res.redirect("/blogs");
})



module.exports = router;
