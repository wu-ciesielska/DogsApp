var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user");
var Dog = require("./models/dog");
var Comment = require("./models/comment");

var newUser1 = new User({username: "DogLover"});
var newUser2 = new User({username: "Pawsome"});

function addUser(user){
    User.register(user, "password", function(err, seededUser){
        if(err){
            console.log(err);
            console.log("fail seed user");
        } else {
            console.log("added new user")
        }
    });
}

function createUsers(){
    addUser(newUser1);
    addUser(newUser2)
}

var dogs = [
    {
        name: "Mango",
        breed: "Border Collie",
        age: 4,
        image: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        author: {
                id: newUser1._id,
                username: newUser1.username
        }
    },
    {
        name: "Zac",
        breed: "Samoyed",
        age: 7,
        image: "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        author: {
            id: newUser2._id,
            username: newUser2.username
        }
    },
    {
        name: "Max",
        breed: "Golden Retriever",
        age: 5,
        image: "https://images.unsplash.com/photo-1508609540374-67d1601ba520?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
        author: {
            id: newUser1._id,
            username: newUser1.username
        }
    }

]

function seedDB(){
    User.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed users!");
        
        Dog.deleteMany({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed dogs!");
            
            Comment.deleteMany({}, function(err) {
                if(err){
                        console.log(err);
                    }
                console.log("removed comments!");
            
    createUsers();

                dogs.forEach(function(seed){
                    Dog.create(seed, function(err, dog){
                        if(err){
                            console.log(err)
                        } else {
                            console.log("added a dog");
                                    
                            Comment.create(
                                {
                                    text: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
                                    author: {
                                    id: newUser1._id,
                                    username: newUser1.username
                                    }
                                }, 
                                function(err, comment){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        dog.comments.push(comment);
                                        dog.save();
                                        console.log("created new comment");
                                    }
                                }
                            );
                        }
                    });
                });
            });
        });
    }); 
 }
  
 module.exports = seedDB;