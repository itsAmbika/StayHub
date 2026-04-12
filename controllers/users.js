const User=require("../models/user.js");


module.exports.signup=async (req,res,next)=>{
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
};
module.exports.renderSignupForm=(req,res)=>{
    console.log("signup route");
    res.render("users/signup.ejs");
};
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login= (req,res)=>{
    req.flash("success","Welcome to StayHub!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);}


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    });
}
