const express= require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing= require("../models/listing.js");

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
router.get("/new",(req,res)=>{
    res.render("listings/new");
});
//get post request from form
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
     const newlisting=new Listing(req.body.listing);
     await newlisting.save();
     res.redirect("/listings");

    }));
router.get("/:id/edit",wrapAsync(async(req,res)=>{
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
   const listing=await Listing.findById(id).populate("reviews");
   if (!listing) {
       throw new ExpressError(404, "Listing not found");
   }
   res.render("listings/show",{listing});

}));
//edit data
router.put("/:id" , validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id", wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
}));


module.exports=router;