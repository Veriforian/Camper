const express    = require("express"),
      router     = express.Router({mergeParams: true}),
      middleware = require("../middleware/index"),
      Campground = require("../models/campground");

// Index Route - show data //
router.get("/", (req, res) => {   
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log("there was an error:");
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
});

// New route - form page to create data //
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Create Route - post route to add data to db // 
router.post("/", middleware.isLoggedIn, (req, res) => {
    let formData = req.body.campground
    let author = {id: req.user._id, username: req.user.username};
    let newCampground = {name: formData.name, image: formData.image, description: formData.description, price: formData.price, author: author};
    Campground.create(newCampground, (err, newCampground) => {
        if(err) {
            console.log("There was an error:");
            console.log(err);   
        } else {
            req.flash("success", "Campground created!");
            res.redirect("/campgrounds", );
        }
    });
});

//Show route - individual data route for details //
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            // res.render("show", {campground: foundCampground});
            res.render("campgrounds/show", {campground: foundCampground});
        };
    });
});

//Edit route - show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});        
    });
});

//Update route - change data in campground database
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, newCampground) => {
        if(err) {
            console.log(err);
            return res.redirect(`/campgrounds/${newCampground._id}`);
        }
        res.redirect(`/campgrounds/${newCampground._id}`);
    });
});

//Destroy route - deletes campground from database
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
            return res.redirect(`/campgrounds/${campground._id}`);
        }
        campground.remove();
        req.flash("error", "Campground deleted");
        res.redirect("/campgrounds");
    });
});

module.exports = router;