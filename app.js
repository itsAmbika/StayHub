const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path")
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const methodOverride=require("method-override");
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
app.post("/listings",wrapAsync(async(req,res,next)=>{
     if(!req.body.listing){
        throw new ExpressError(400,"Invalid listing data");
     }
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
   const listing=await Listing.findById(id);
   res.render("listings/show",{listing});

}));
//edit data
app.put("/listings/:id" ,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Invalid listing data");
     }
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
app.all(/.*/ , (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {status=500,message="Something went wrong"}=err;
    res.status(status).send(message);
});
app.listen(8080, ()=>{
   console.log("server is listening");
});
