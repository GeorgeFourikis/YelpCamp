var Campground = require("../models/campground");
var Comment = require("../models/comment");
//  all middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          req.flash("error", "Campground not found! :( ")
          res.redirect("/campgrounds");
        } else {
          //does user own the Camground?
          if(foundCampground.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          req.flash("error", "Comment not found! :( ")
          res.redirect("back");
        } else {
          //does user own the Comment?
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash("error", "You have not a permission to do that!");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login to proceed!");
  res.redirect("/login");
}


module.exports = middlewareObj;
