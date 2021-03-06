var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var descr = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampGround = {name: name, image: image, description: descr, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
          res.render("campgrounds/edit", {campground: foundCampground});
    });
  });

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership,  function(req, res){
  //find and update the correct Campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      req.flash("error", "Something went wrong :( ")
      console.log(err);
    } else {
      //Redirect after done
      req.flash("success", "Campground Updated Successfully");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership,  function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});


// exporting the router always
module.exports = router;
