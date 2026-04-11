const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing= require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    next();
}

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

router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
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
   const listing=await Listing.findById(id).populate("reviews").populate("owner");
   if (!listing) {
       throw new ExpressError(404, "Listing not found");
   }
   res.render("listings/show",{listing});

}));
//edit data
router.put("/:id" , isLoggedIn, validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted successfully!");
     res.redirect("/listings");
}));


module.exports=router;