const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

const Campground = require("../models/campground");
const Comment = require("../models/comment");


// root route
router.get("/", function(req, res) {
    res.render("landing");
});

/*
 const campgrounds = [
        {
         name: "Suwon grounds", image: "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?auto=format&fit=crop&w=1510&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D"  
        },
        {
         name: "tokyo montains", image: "https://images.unsplash.com/photo-1498696815880-6fd23346fe56?auto=format&fit=crop&w=1500&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D"  
        },
        {
         name: "seoul hills", image: "https://images.unsplash.com/photo-1486758206125-94d07f414b1c?auto=format&fit=crop&w=1500&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D" 
        }
    ];

*/


// ===================================

// AUTH ROUTES

// ===========

// REGISTER FORM

router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});


router.post("/register", function( req, res){
    const newUser = new User({username: req.body.username});
    User.register( newUser, req.body.password, function( error, user){
       if ( error) {
           req.flash("error", error.message);
           return res.render("register", {error: error.message});
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Campgrounds " + req.body.username);
           res.redirect("/campgrounds"); 
       });
    });
});

// LOGIN FORM 

router.get("/login", function( req, res) {
   res.render("login", {page: 'login'}); 
});

// handle login
// app.post("/login", middleware, callback{})
router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function( req, res) {
   
});

// Logout

router.get("/logout", function(req, res){
   req.logout(); 
   req.flash("success", "Logged out");
   res.redirect("/campgrounds");
});

// Middleware
/*
function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
*/
module.exports= router;