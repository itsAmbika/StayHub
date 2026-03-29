const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path")
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const methodOverride=require("method-override");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review=require("./models/review.js");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
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
app.get("/",(req,res)=>{
   res.send("hii");
});
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
}

// index route
app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}));
// new lisiting form
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});
//get post request from form
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
     const newlisting=new Listing(req.body.listing);
     await newlisting.save();
     res.redirect("/listings");

    }));
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit", {listing});
}));
//show route 
app.get("/listings/:id",wrapAsync(async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id).populate("reviews");
   res.render("listings/show",{listing});

}));
//edit data
app.put("/listings/:id" , validateListing, wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
}));

//review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));
//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
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
