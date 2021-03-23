const express = require("express");
const router = express.Router();

const {loggedUserRouteGuard} = require("../middleware/routingGuard");
router.use(loggedUserRouteGuard);

// route for logged user to manage his profile, and see other data
router.route("/profile")
.get((req, res)=> {
    res.render("user/profile")
})

// route for other logged users to see user who left comment or blog, stats
router.route("/:username/profile")
.get((req, res)=> {
    res.render("user/userData")
})

module.exports = router;