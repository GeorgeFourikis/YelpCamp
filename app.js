var express    = require("express");
var app        = express();
var request    = require("request");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var seedDB     = require("./seeds");
var Campground = require("./models/campground");
var User       = require("./models/user");
var Comment    = require("./models/comment");

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

//INDEX --SHOW ALL CAMPGROUNDS.
app.get("/campgrounds", function(req, res){
  // Get campgrounds from DB
  Campground.find({}, function(err, myCampgrounds){
    if(err){
      console.log(err);
    } else{
      res.render("campgrounds/index", {campgrounds : myCampgrounds});
    }
  });
  // res.render("campgrounds", {campgrounds : campgrounds});
});

//CREATE-ADD NEW CAMPGROUNDS TO DB.
app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var descr = req.body.description;
  var newCampGround = {name: name, image: image, description: descr};
  // campgrounds.push(newCampGround);
  // Create a new CampGround and save to DB
  Campground.create(newCampGround, function(err, newlyCreated){
    if(err){
      console.log(err);
    }else{
        // redirect back to campgrounds
        res.redirect("/campgrounds");
    }
  });
});

//NEW - SHOW FORM TO CREATE A NEW CAMPGROUND.
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

//SHOW - BY ID(more info on a specific campground)
app.get("/campgrounds/:id", function(req, res){
    //Find the CampGround with provided IP
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
        console.log(err);
      }else{
        res.render("campgrounds/show", {campground : foundCampground});
      }
    });
});

// =============================
// COMMENTS ROUTES
// =============================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // find Campground byID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  // Lookup Campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      redirect("/campgrounds");
    }else{
        // Create a new comment
        Comment.create(req.body.comment, function(err, comment){
          if(err){
            console.log(err);
          }else{
            // Connect new comment to campground
            campground.comments.push(comment);
            campground.save();
            // redirect to campground showpage
            res.redirect("/campgrounds/" + campground._id);
          }
        })
    }
  })
});


// ===========================
// AUTH ROUTES
// ===========================

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

// handle sign-up logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// show login form
app.get("/login", function(req, res){
  res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local",
{
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req, res){
});

// add logout ROUTE
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


app.listen(3000, function(){
  console.log("YelpCamp Server is Up...")
});
