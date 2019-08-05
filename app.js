var methodOverride  = require("method-override"),
    LocalStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    flash           = require("connect-flash"),
    app             = express(),
    Dog             = require("./models/dog"),
    User            = require("./models/user"),
    Comment         = require("./models/comment"),
    port            = process.env.PORT || 3000;
    seedDB          = require("./seeds");

var indexRoutes     = require("./routes/index"),
    dogRoutes       = require("./routes/dogs"),
    commentRoutes   = require("./routes/comments");

// database connection setting, use local or MongoDB Atlas
var connectionString = "mongodb://localhost:27017/dogs_app";

mongoose.connect(connectionString, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();


app.use(require("express-session")({
    secret: "Dogs are super cute and funny, love them!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use("/dogs", dogRoutes);
app.use("/dogs/:id/comments", commentRoutes);


app.listen(port, function(){
    console.log("The Server Has Started!");
});