const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment");
      

//-----------------//
// Comments routes //
//-----------------//

//Comment new route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err || !campground) {
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/campgrounds")
        } else {
            res.render("comments/new", {campground: campground});
        };
    });
});

//Comment create route
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash("success", "Added a new comment!");
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                };
            });
        };
    });
});

//Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            console.log(err);
            return res.redirect("back");
        }
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

//Comment Update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, newComment) => {
        if(err) {
            console.log(err);
            return res.redirect("back");
        }
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

//Comment Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            console.log(err);
            return res.redirect("back");
        }
        req.flash("error", "Comment deleted");
        res.redirect(`/campgrounds/${req.params.id}`);
    })
});

module.exports = router;