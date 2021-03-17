const express = require("express");
const router = express.Router();

router.route("/login")
.get((req,res)=> {
    res.render("auth/login")
})

module.exports = router;