const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new");};

module.exports.showListing=async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id).populate({path:"reviews", populate: { path: "author" }}).populate("owner");
   if (!listing) {
       req.flash("error","Listing not found");
       return res.redirect("/listings");
   }
   res.render("listings/show",{listing});

};
module.exports.createListing=async(req,res,next)=>{
     const newlisting=new Listing(req.body.listing);
     newlisting.owner=req.user._id;
     
     // Handle file upload
     if(req.file) {
         newlisting.image = {
             url: req.file.path,
             filename: req.file.filename
         };
     }
     
     await newlisting.save();
     req.flash("success","Successfully made a new listing!");
     res.redirect("/listings");
    }
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let originalUrl=listing.image && listing.image.url ? listing.image.url : "https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg";
    originalUrl=originalUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit", {listing, originalUrl});
};
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
     
    await listing.save();}
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing=async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing deleted successfully!");
     res.redirect("/listings");
};
