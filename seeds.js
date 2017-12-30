const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");


const data = [
            {
                name: "Our date",
                image: "https://images.pexels.com/photos/615488/pexels-photo-615488.jpeg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb",
                description: "The night you and I connected forever..."
            },
            {
                name: "Cosmos & Stars",
                image: "https://images.pexels.com/photos/2154/sky-lights-space-dark.jpg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb",
                description: "The everlasting shining stars..."
            },
            {
                name: "Camp fire",
                image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb",
                description: "Sharing our deepest secrets..."
            }
    ];

function seedDB() {
    // Remove all campgrounds
    Campground.remove({}, function( error) {
      if ( error) {
            console.log( error);
        }
        console.log("removed campgrounds");
    // remove existing campgrounds and then add new campgrounds
    // Add campgrounds
    
    data.forEach(function(seed){
        Campground.create( seed, function( error, campground){
            if ( error) {
                console.log( error);
            } else {
                console.log( " added a campground");
                // create a comment
                Comment.create(
                    {
                        text: "Just us in this infinit world",
                        author: "Hosmane"
                    
                }, function( error, comment) {
                    if ( error ) {
                        console.log( error);
                    } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Create new comment");
                    }
                });
            }
        });
    }); 
 });  
    // Add comments
}

module.exports = seedDB;