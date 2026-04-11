const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path")
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const methodOverride=require("method-override");
const listingRoutes=require("./routes/listing.js");
const reviewRoutes=require("./routes/review.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const useroutes=require("./routes/user.js");

const flash=require("connect-flash");
const session=require("express-session");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expire: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};
app.get("/",(req,res)=>{
   res.send("hii");
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});



const mongo_url="mongodb://127.0.0.1:27017/StayHub";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.engine('ejs', ejsMate);

app.use("/listings", listingRoutes);

app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", useroutes);

app.all(/.*/ , (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("error",{message});
});
app.listen(8080, ()=>{
   console.log("server is listening");
});
