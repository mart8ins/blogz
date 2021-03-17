const express = require("express");
const router = express.Router();


/* LOGIN */
router.route("/login")
.get((req,res)=> {
    res.render("auth/login")
})
.post((req,res)=> {
    res.redirect("/")
})

/* REGISTER  */
router.route("/register")
.get((req,res)=> {
    res.render("auth/register")
})
.post((req,res)=> {
    console.log(req.body)
    res.redirect("/")
})

/* LOGOUT */
router.route("/logout")
.post((req,res)=> {
    res.redirect("/")
})




module.exports = router;