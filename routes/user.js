const express= require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
router.get("/signup",(req,res)=>{
    console.log("signup route");
    res.render("users/signup.ejs");
})
router.post("/signup",async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    newUser=new User({username,email});
    user=await User.register(newUser,password);
    console.log(user);
    req.flash("success","Welcome to StayHub!");
    res.redirect("/listings");}
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

module.exports=router;