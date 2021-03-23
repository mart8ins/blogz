const express = require("express");
const router = express.Router();

const {loggedUserRouteGuard} = require("../middleware/routingGuard");
router.use(loggedUserRouteGuard);

router.route("/profile")
.get((req, res)=> {
    res.render("user/profile")
})

module.exports = router;