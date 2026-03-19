const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path")

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
app.get("/",(req,res)=>{
   res.send("hii");
});
// index route
app.get("/listings", async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
})
//show route 
app.get("/listings/:id",async (req,res)=>{
   let {id}=req.params;
   const listing=await Listing.findById(id);
   res.render("listings/show",{listing});

});
app.listen(8080, ()=>{
   console.log("server is listening");
});
