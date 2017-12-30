const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const Comment = require("./models/comment");

const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");

const methodOverride = require("method-override");

const flash = require("connect-flash");



// setting up the database
mongoose.connect("mongodb://localhost/yelp_camp");

const Campground = require("./models/campground");

const seedDB = require("./seeds");


// seed database
//seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "I am literally just one idea away from making billions, keep searching",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to add currentUser:req.user to all routes
app.use(function( req, res, next){
    res.locals.currentUser = req.user; // pass currentUser to every single template
//    res.locals.message = req.flash("error"); 
    res.locals.error = req.flash("error");
    res.locals.success= req.flash("success");
    next();  // currentUser
});

app.locals.moment = require("moment");

/*

You were using your routes before body-parser configuration line 
(which enables us to recieve data from forms to our backend), 
so the username value couldn't get through to the register/login route.

*/
// tell the server to use bodyParser and pass in an object on it
app.use(bodyParser.urlencoded({extended:true})) // for the use of body parser

app.use(methodOverride("_method"));
/*
Campground.create({
    name: "The hobbit",
    image: "https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?auto=format&fit=crop&w=1500&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    description: "The hobbit sage has an amazing scenario"
    
}, function(error, campground){
    if ( error ){
        console.log(error);
    } else {
        console.log("Images in place");
        console.log(campground);
    }
});
*/

app.set("view engine", "ejs");

// __dirname directory name
app.use(express.static(__dirname + "/public"));


app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.get("*", function(req, res){
    res.send("404: Page not found...");
});


app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Server running at 100%"); 
});

