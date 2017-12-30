const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");


// show all campgrounds
router.get("/", function(req, res){
    // retrieve the campgrounds from the database
    Campground.find({}, function(error, allCampgrounds){
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/index" , {campgrounds : allCampgrounds, page: 'campgrounds'});
        }
    });
});


router.post("/", middleware.isLoggedIn,function(req, res){
    const name = req.body.name; // get data from the form = req.body
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    // we need to push an object inside an array
    const newCampground = {
                           name : name, 
                           image: image,
                           description: description,
                           author: author
                          };
                          
    Campground.create(newCampground, function(error, newlyCreated ){
     if ( error) {
        console.log(error);
    } else {
        res.redirect("/campgrounds");
       }
    });                     
    
   // campgrounds.push(newCampground);
  //  res.redirect("/campgrounds"); // default of a redirect is to do it as a get request
    
});



router.get("/new", middleware.isLoggedIn,function(req, res){
   res.render("campgrounds/new"); // form for a new campground
});

// campground/ anything, any single word
router.get("/:id", function( req, res){
 //  router.get("/:id", function( req, res){
    // find the campground with provide ID
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if ( error) {
            console.log(error);
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
  //  res.render("show");
});


// EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, function( req, res) {
         Campground.findById(req.params.id, function( error, foundCampground){
                   res.render("campgrounds/edit", {campground: foundCampground});
      });
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership,function(req, res) {
   // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
       if ( error) {
           res.redirect("/campgrounds"); 
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
   // redirect page to another page
});


router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function( error ){
        if ( error) {
            res.redirect("/campgrounds"); 
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
// middleware

/*
function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 
function checkCampgroundOwnership(req, res , next){
 if ( req.isAuthenticated()){
         Campground.findById(req.params.id, function( error, foundCampground){
           if ( error) {
            res.redirect("back"); // error, take the user to the previous page
            //res.redirect("/campgrounds");
           } else {
               // does user own the campground
               if ( foundCampground.author.id.equals(req.user._id)) {
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






router.get("/:id/edit",checkCampgroundOwnership(req, res, next), function( req, res) {
    // is user logged in
    if ( req.isAuthenticated()){
         Campground.findById(req.params.id, function( error, foundCampground){
           if ( error) {
            res.redirect("back"); // error, take the user to the previous page
            //res.redirect("/campgrounds");
           } else {
               // does user own the campground
               if ( foundCampground.author.id.equals(req.user.id)) {
                   next(); // move to update/ edit
                  // res.render("campgrounds/edit", {campground: foundCampground});
               } else {
                   //res.send("No permission to Edit/Delete this image.");
                   res.redirect("back"); // if you dont own it
                   
               }
           }
        
      });

*/