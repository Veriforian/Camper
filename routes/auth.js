const express     = require("express"),
      router      = express.Router(),
      passport    = require("passport"),
      User        = require("../models/user");
      

//-----------------//
//   Auth routes   //
//-----------------//

//User registration logic
router.post("/register", (req, res) => {
    let newUser = new User({email: req.body.email, username: req.body.username}) 
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

//User login logic
router.post("/login", passport.authenticate("local", {
    failureRedirect: "back",
    failureFlash: true,
    successFlash: `Welcome back to YelpCamp!`
}), (req, res) => {
    res.redirect(req.session.returnTo || '/campgrounds');
    delete req.session.returnTo;
});

//Logout logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged off!")
    res.redirect("/campgrounds");
});

module.exports = router;