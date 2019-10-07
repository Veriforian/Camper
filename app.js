// Add packages to app //
const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      session          = require("express-session"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      flash            = require("connect-flash"),
      methodOverride   = require("method-override"),
      Campground       = require("./models/campground"),
      Comment          = require("./models/comment"),
      User             = require("./models/user"),
      seedDB           = require("./seeds");

//Connect route files
const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      authRoutes       = require("./routes/auth"),
      indexRoutes      = require("./routes/index");

// Configure express / and add middleware 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method")); 
app.use(flash());
//Initialize database
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});
//Seeding the database
//seedDB();
//Configure Passport
app.use(session({
    secret: "Ben Jones was born on the 28th of May, 2000",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Create new universal middleware
app.use((req, res, next) => {
    res.locals.moment = require("moment");
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", authRoutes);


// Start Server //
app.listen(3000, () => {
    console.log("YelpCamp app started on port 3000");
});