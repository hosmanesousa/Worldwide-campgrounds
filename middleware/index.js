const Campground = require("../models/campground");
const Comment = require("../models/comment");
// file for middleware

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res , next){
 if ( req.isAuthenticated()){
         Campground.findById(req.params.id, function( error, foundCampground){
           if ( error) {
            req.flash("error", "Campground not found");
            res.redirect("back"); // error, take the user to the previous page
            //res.redirect("/campgrounds");
           } else {
               // does user own the campground
               if ( foundCampground.author.id.equals(req.user._id)) {
                   next(); // move to update/ edit
                  // res.render("campgrounds/edit", {campground: foundCampground});
               } else {
                   req.flash("error", "You do not have permission");
                   //res.send("No permission to Edit/Delete this image.");
                   res.redirect("back"); // if you dont own it
                   
               }
           }
      });
   } else {
       req.flash("error", "You need to be logged in...");
       res.redirect("back");
   }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
 if ( req.isAuthenticated()){
         Comment.findById(req.params.comment_id, function( error, foundComment){
           if ( error) {
            res.redirect("back"); // error, take the user to the previous page
            //res.redirect("/campgrounds");
           } else {
               // does user own the campground
               if ( foundComment.author.id.equals(req.user._id)) {
                   next(); // move to update/ edit
                  // res.render("campgrounds/edit", {campground: foundCampground});
               } else {
                   //res.send("No permission to Edit/Delete this image.");
                   req.flash("error", "You do nit have permission");
                   res.redirect("back"); // if you dont own it
               }
           }
      });
   } else {
    req.flash("error", "You need to be logged in");
       res.redirect("back");
   }
 }
 
 
 
middlewareObj.isLoggedIn = function( req, res, next) {
    if ( req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be signed in!!!");
    res.redirect("/login");
}
 
 
module.exports = middlewareObj;