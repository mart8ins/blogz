const express = require("express");
const router = express.Router();

router.route("/profile")
.get((req, res)=> {
    res.render("user/profile")
})

module.exports = router;