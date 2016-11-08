var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


router.get("/new", isLoggedIn, function(req, res){
  // find Campground byID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })
});


// Comments create
router.post("/", isLoggedIn, function(req, res){
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
            // add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
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

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
