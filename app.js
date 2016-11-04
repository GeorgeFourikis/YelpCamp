var express    = require("express");
var app        = express();
var request    = require("request");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var seedDB     = require("./seeds");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");


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

app.get("/campgrounds/:id/comments/new", function(req, res){
  // find Campground byID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function(req, res){
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



app.listen(3000, function(){
  console.log("YelpCamp Server is Up...")
});
