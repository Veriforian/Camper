const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment");
      

//-----------------//
// Comments routes //
//-----------------//

//Comment create route
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findOne({slug: req.params.slug}, (err, foundCampground) => {
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
                    res.redirect(`/campgrounds/${foundCampground.slug}`);
                };
            });
        };
    });
});

//Comment Update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, newComment) => {
        if(err) {
            console.log(err);
            return res.redirect("back");
        }
        res.redirect(`/campgrounds/${req.params.slug}`);
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
        res.redirect(`/campgrounds/${req.params.slug}`);
    })
});

module.exports = router;