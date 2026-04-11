const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");


// index route
router.get("/", wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}));
// new lisiting form
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listings/new");
});
//get post request from form
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res,next)=>{
     const newlisting=new Listing(req.body.listing);
     newlisting.owner=req.user._id;
     await newlisting.save();
     req.flash("success","Successfully made a new listing!");
     res.redirect("/listings");

    }));

router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", {listing});
}));
//show route 
router.get("/:id",wrapAsync(async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id).populate({path:"reviews", populate: { path: "author" }}).populate("owner");
   if (!listing) {
       throw new ExpressError(404, "Listing not found");
   }
   res.render("listings/show",{listing});

}));
//edit data
router.put("/:id" , isLoggedIn,isOwner, validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted successfully!");
     res.redirect("/listings");
}));


module.exports=router;