var express       = require("express");
var app           = express();
var request       = require("request");
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var flash         = require("connect-flash");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride= require("method-override");
var seedDB        = require("./seeds");
var Campground    = require("./models/campground");
var User          = require("./models/user");
var Comment       = require("./models/comment");

// requiring the routes
var commentRoutes     = require("./routes/comments");
var campgroundRoutes  = require("./routes/campgrounds");
var indexRoutes        = require("./routes/index");

console.log();

// seed the database
// seedDB();

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

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
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
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

app.set('port', process.env.PORT || 3000);


app.listen(app.get("port"), function(){
  console.log("YelpCamp Server is Up...")
});

// app.listen(3000, function(){
//   console.log("YelpCamp Server is Up...")
// });
