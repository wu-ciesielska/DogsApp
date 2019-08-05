var express = require("express");
var router = express.Router({mergeParams: true});
var Dog = require("../models/dog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW comment route - renders a new comment form

router.get("/new", middleware.isLoggedIn, function(req, res){
    Dog.findById(req.params.id, function(err, dog){
        if(err){
            console.log(err);
        } else {
            if(!dog){
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            res.render("comments/new", {dog: dog});
        }
    });
});

// CREATE comment route - creates new comment, then redirects

router.post("/", middleware.isLoggedIn, function(req, res){
    Dog.findById(req.params.id, function(err, dog){
        if(err){
            console.log(err);
            res.redirect("/dogs");
        } else {
            if(!dog){
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    dog.comments.push(comment);
                    dog.save();
                    this.setTimeout(function(){
                        res.redirect("/dogs/" + dog._id)
                    }, 1000);
                }
            });
        }
    });
});

// EDIT comment route - renders an edit comment form

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            if(!foundComment){
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            res.render("comments/edit", {dog_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE comment route - updates a comment, then redirects

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            if(!updatedComment){
                req.flash("error", "Item not found");
                return res.redirect("back");
            }
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

// DESTROY comment route - deletes a comment, then redirects
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully removed");
            res.redirect("/dogs/" + req.params.id);
        }
    });
});

module.exports = router;