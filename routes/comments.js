const express = require("express");
const router = express.Router({mergeParams:true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// ===================================
// COMMENTS ROUTES

router.get("/new",middleware.isLoggedIn, function(req, res){
    
    // find campground by id
    Campground.findById(req.params.id, function( error, campground) {
       if ( error) {
           console.log(error);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
});


router.post("/", middleware.isLoggedIn, function ( req, res) {
   //lookup campgroung using ID
   Campground.findById(req.params.id, function( error, campground){
       if ( error ) {
           console.log(error);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function( error, comment){
               if ( error ) {
                   req.flash("error", "Oops...Something went wrong...");
                   console.log( error);
               } else {
                   // add username and id to comment
                   // req.user contains Id and username, of the current logged in user
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save(); // Very important
                   req.flash("success", "Successfully added comment");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   });
    
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function( error, foundComment){
        if ( error) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});     
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
       if ( error) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});


// Comment destroy route

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   // find by id and remove
   //Comment.findByIdAndRemove()
   Comment.findByIdAndRemove(req.params.comment_id, function( error) {
      if ( error) {
          res.redirect("back");
      } else {
          req.flash("success", "Comment deleted");
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});


/*

function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res , next){
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
                   res.redirect("back"); // if you dont own it
                   
               }
           }
      });
   } else {
       res.redirect("back");
   }
}

*/


module.exports = router;