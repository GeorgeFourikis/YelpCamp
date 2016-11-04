var mongoose = require("mongoose");
//Schema Setup:
var commentSchema =  mongoose.Schema({
  text: String,
  author: String
});

// Setting the Model:
module.exports = mongoose.model("Comment", commentSchema);
