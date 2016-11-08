var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
{
  name: "Salmon Creek", image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
},
{
  name: "Granite Hill", image: "https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
},
{
  name: "Mountain Goat's Rest", image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
}]

function seedDB(){
  //remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed Camgrounds");
    //add a few campgrounds
    // data.forEach(function(seed){
    //   Campground.create(seed, function(err, campground){
    //     if(err){
    //       console.log(err);
    //     }else{
    //       console.log("added!");
    //       //add comments
    //       Comment.create({text: "This place is really great!",author: "Homer"}, function(err, comment){
    //         if(err){
    //           console.log(err);
    //         }else{
    //           campground.comments.push(comment);
    //           campground.save();
    //           console.log("Comment created!!");
    //         }
    //
    //       });
    //     }
    //   });
    // });
  });
  //add comments
}

module.exports  = seedDB;
