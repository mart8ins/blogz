module.exports.loggedUserRouteGuard = function(req, res, next){
    if(!req.session.userId){
        req.flash("error", "Please sign in to access requested content!")
        return res.redirect("/auth/login");
    }
    next();
}