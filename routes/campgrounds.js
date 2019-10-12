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
router.get("/:slug", (req, res) => {
    Campground.findOne({slug: req.params.slug}).populate("comments").exec((err, foundCampground) => {
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
router.get("/:slug/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findOne({slug: req.params.slug}, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});        
    });
});

//Update route - change data in campground database
router.put("/:slug",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findOne({slug: req.params.slug}, function(err, campground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           campground.name = req.body.campground.name;
           campground.description = req.body.campground.description;
           campground.image = req.body.campground.image;
           campground.price = req.body.campground.price;
           campground.save(function (err) {
             if(err){
               console.log(err);
               res.redirect("/campgrounds");
             } else {
               res.redirect("/campgrounds/" + campground.slug);
             }
           });
       }
    });
});

//Destroy route - deletes campground from database
router.delete("/:slug", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findOne({slug: req.params.slug}, (err, campground) => {
        if(err) {
            console.log(err);
            return res.redirect(`/campgrounds/${campground.slug}`);
        }
        campground.remove();
        req.flash("error", "Campground deleted");
        res.redirect("/campgrounds");
    });
});

module.exports = router;