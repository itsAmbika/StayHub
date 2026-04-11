const express= require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
    console.log("signup route");
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsync(async (req,res,next)=>{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const user=await User.register(newUser,password);
    req.login(user,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to StayHub!");
        res.redirect("/listings");
    });
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}), (req,res)=>{
    req.flash("success","Welcome to StayHub!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
});
module.exports=router;