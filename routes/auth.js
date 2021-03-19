const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");


/* LOGIN */
router.route("/login")
.get((req,res)=> {
    res.render("auth/login")
})
.post(async (req,res)=> {
    const {username, password} = req.body.login;
    
    if(username && password){
        // if both inputs exists then check if username exists in db
        let usernameTaken = await User.findOne({username: username});
        // if username exists - compare passwords
        if(usernameTaken) {
            const passwordMatch = await bcrypt.compare(password, usernameTaken.password);
            // passwordMatch ? res.redirect("/") : res.redirect("/auth/login");
            if(passwordMatch) {
                req.session.userId = usernameTaken._id;
                req.session.logged_username = usernameTaken.username;
                res.redirect("/")
            } else {
                res.redirect("/auth/login");
            }
            /* *********************************
            JASATAISA SESSIJA UN JANOSTORO USERS
            ************************************* */
        }
    } else {
        res.redirect("/auth/login")
    }
    
})

/* REGISTER  */
router.route("/register")
.get((req,res)=> {
    
    res.render("auth/register")
})
.post(async (req,res)=> {
    const {username, email, password} = req.body.register;
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
    const newUser = new User({
        username,
        email,
        password: hash
    })
    await newUser.save();
    /* *********************************
            JASATAISA SESSIJA UN JANOSTORO USERS
            ************************************* */
    res.redirect("/")
})

/* LOGOUT */
router.route("/logout")
.post((req,res)=> {
    req.session.userId = null;
    req.session.logged_username = null;
    res.redirect("/")
})




module.exports = router;