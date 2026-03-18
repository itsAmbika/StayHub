const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const mongo_url="mongodb://127.0.0.1:27017/StayHub";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url);
}
app.get("/",(req,res)=>{
   res.send("hii");
});

app.get("/testlisting",async(req,res)=>{
    let sample= new Listing({
        title:"my home",
        price:100,
        location:"Kolkata",
        country: "India"
    });
    await sample.save();
    res.send("successful");
});
app.listen(8080, ()=>{
   console.log("server is listening");
});
