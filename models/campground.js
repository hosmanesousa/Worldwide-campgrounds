const mongoose = require("mongoose");
  // schema
const campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   createAt: {
       type: Date,
       default: Date.now
   },
   author: {
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       },
       username: String
   },
   comments: [ // the comment property should be an array of comment ids
            { // embedding and ID or reference to the comments
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
       ]
});

// make a model to use the schema above designed
const Campground = mongoose.model("Campground", campgroundSchema)

module.exports = Campground;