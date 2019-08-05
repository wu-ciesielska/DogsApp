var express = require("express");
var router = express.Router();
var Dog = require("../models/dog");
var middleware = require("../middleware");

// INDEX route - lists all dogs
router.get("/", function(req, res){
    Dog.find({}, function(err, allDogs){
        if(err){
            console.log(err);
        } else {
            res.render("dogs/index", {dogs: allDogs});
        }
    });
});

// CREATE route - creates new dog, then redirects
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var breed = req.body.breed;
    var age = req.body.age;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newDog = {name: name, breed: breed, age: age, image: image, description: desc, author: author}

    Dog.create(newDog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            if(!newlyCreated) {
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            res.redirect("/dogs");
        }
    });
});

// NEW route - shows new dog form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("dogs/new");
});

// SHOW route - shows information about specific dog
router.get("/:id", function(req, res){
    Dog.findById(req.params.id).populate("comments").exec(function(err, foundDog){
        if(err){
            console.log(err)
        } else {
            if(!foundDog) {
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            res.render("dogs/show", {dog: foundDog});
        }
    });
});

// EDIT route - shows edit form for a specific dog
router.get("/:id/edit", middleware.checkDogOwnership, function(req, res){
    Dog.findById(req.params.id, function(err, foundDog){
        if(err){
            console.log(err)
            res.redirect("back");
        } else {
            if(!foundDog) {
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            res.render("dogs/edit", {dog: foundDog});    
        }
    }); 
});

// UPDATE route - updates particular dog, then redirects
router.put("/:id", middleware.checkDogOwnership, function(req, res){
    Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            if(!updatedDog) {
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            req.flash("success", updatedDog.name + " successfully updated!");
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

// DESTROY route - deletes a particular dog, then redirects
router.delete("/:id", middleware.checkDogOwnership, function(req, res){
    Dog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Dog successfully removed");
            res.redirect("/dogs");
        }
    });
});

module.exports = router;