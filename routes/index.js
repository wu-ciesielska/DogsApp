var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT route
router.get("/", function(req, res){
    res.render("home");
});

// renders REGISTER form
router.get("/register", function(req, res){
    res.render("register");
});

// REGISTER logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }

        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the world of dogs, " + user.username);
            res.redirect("/dogs");
        });
    });
});



// renders LOGIN form
router.get("/login", function(req, res){
    res.render("login");
});

// LOGIN logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dogs",
    failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/dogs");
})

module.exports = router;