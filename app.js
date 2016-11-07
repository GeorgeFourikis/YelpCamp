var express       = require("express");
var app           = express();
var request       = require("request");
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var seedDB        = require("./seeds");
var Campground    = require("./models/campground");
var User          = require("./models/user");
var Comment       = require("./models/comment");

// requiring the routes
var commentRoutes     = require("./routes/comments");
var campgroundRoutes  = require("./routes/campgrounds");
var indexRoutes        = require("./routes/index");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Vlahunter rulez ur life!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function(req, res){
  res.render("landing");
});

// express router,i require route files
// i use the prefix "/xxxxxxx/xxxxxx" to shorten up the paths on my route files
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, function(){
  console.log("YelpCamp Server is Up...")
});
