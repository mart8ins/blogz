const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../errors/catchAsync");

const bcrypt = require("bcrypt");


/* LOGIN */
router.route("/login")
.get((req,res)=> {
    res.render("auth/login")
})
.post(catchAsync(async (req,res)=> {
    const {username, password} = req.body.login;
    // using User models statics method to validate user
    const validUser = await User.validUser(username, password);
    if(validUser) {
        req.session.email = validUser.email;
        req.session.userId = validUser._id;
        req.session.username = validUser.username;
        req.flash("success", `Sveicināts lietotāj, ${username}!`);
        return res.redirect("/")
    } else {
        req.flash("error", "Username or password incorrect!")
        return res.redirect("/auth/login");
    }
}))

/* REGISTER  */
router.route("/register")
.get((req,res)=> {
    res.render("auth/register")
})
.post(catchAsync(async (req,res)=> {
    const {username, email, password} = req.body.register;
    const isUsernameTaken = await User.findOne({username: username});
    const isEmailTaken = await User.findOne({email: email});

    const regex = /^[a-zA-Z0-9]*$/.test(username);
    if(!regex) return req.flash("error", "Speciālās rakstīmes lietotājvārdā nav atļautas") && res.redirect("/auth/register");

    if(isUsernameTaken) return req.flash("error", "Username is already taken! Choose different!") && res.redirect("/auth/register");
    if(isEmailTaken) return req.flash("error", "Email is already registred!") && res.redirect("/auth/register");
    
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hash
    })
    await newUser.save();
    req.flash("success", `Paldies par reģistrāciju, ${username}!`);
    // after registering finding new users id to store in session
    const regSuccess = await User.findOne({username: username});
    req.session.userId = regSuccess._id;
    req.session.username = regSuccess.username;
    req.session.email = regSuccess.email;
    res.redirect("/")
}))

/* LOGOUT */
router.route("/logout")
.post((req,res)=> {
    req.session.userId = null;
    req.session.username = null;
    req.session.email = null;
    res.redirect("/")
})




module.exports = router;