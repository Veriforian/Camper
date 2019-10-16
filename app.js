//Set Environment Variables with dotenv
require("dotenv").config({path:__dirname+'/./app.env'});
// Add packages to app //
const express          = require("express"),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      session          = require("express-session"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      flash            = require("connect-flash"),
      methodOverride   = require("method-override"),
      //Connect Mongoose model files
      Campground       = require("./models/campground"),
      Comment          = require("./models/comment"),
      User             = require("./models/user"),
      seedDB           = require("./seeds");
      app = express();
//Connect route files
const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      authRoutes       = require("./routes/auth"),
      indexRoutes      = require("./routes/index");
// Configure express / and add middleware 
app.set("view engine", "ejs");
app.use(session({
    secret: "Ben Jones was born on the 28th of May, 2000",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method")); 
app.use(flash());
//Initialize database
mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});
//Seeding the database - for testing
//seedDB();
//Configure Passport
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
//Telling the route files to what to expect in their routes
app.use("/", indexRoutes);
app.use("/campgrounds/:slug/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", authRoutes);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Start Server //
app.listen(process.env.PORT || 3000, () => {
    console.log("YelpCamp app started");
});