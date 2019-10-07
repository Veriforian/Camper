const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User     = require("../models/user");
      

//-----------------//
//   Auth routes   //
//-----------------//

//Render register form
router.get("/register", (req, res) => {
    res.render("register");
});

//User registration logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username}) 
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

//Render login form
router.get("/login", (req, res) => {
    res.render("login");
});

//User login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: `Welcome back to YelpCamp!`
}), (req, res) => {});

//Logout logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged off!")
    res.redirect("/campgrounds");
});

module.exports = router;