var mongoose = require("mongoose");
//Schema Setup:
var commentSchema =  mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

// Setting the Model:
module.exports = mongoose.model("Comment", commentSchema);
