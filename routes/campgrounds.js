var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//INDEX --SHOW ALL CAMPGROUNDS.
router.get("/", function(req, res){
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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
  res.render("campgrounds/new");
});

//SHOW - BY ID(more info on a specific campground)
router.get("/:id", function(req, res){
    //Find the CampGround with provided IP
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
        console.log(err);
      }else{
        res.render("campgrounds/show", {campground : foundCampground});
      }
    });
});

// exporting the router always
module.exports = router;
