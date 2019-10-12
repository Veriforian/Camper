const Campground = require("../models/campground"),
      Comment    = require("../models/comment");

//All middleware used in specific routes
const middlewareObj = {};

//Campground authorization
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findOne({slug: req.params.slug}, (err, foundCampground) => {
            if(err || !foundCampground) {
                req.flash("error", "Campground not found.");
                return res.redirect("back");
            }
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that, sorry!");
                res.redirect("back");        
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
};

//Comment authorization
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment) {
                req.flash("error", "Comment not found.");
                return res.redirect("back");
            }
            if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that, sorry!");
                res.redirect("back");        
            };
        });    
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    };
};

//Login checking
middlewareObj.isLoggedIn =  function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj