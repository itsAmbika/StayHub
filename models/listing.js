const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema= new Schema({
   title:{
    type:String,
    required:true,
   },
   description:String,
   image:{
    filename:String,
    url:{
    type:String,
    default:"https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg",
    set: (v)=> v === "" ? "https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg" : v,
   }},
   price: Number,
   location: String,
   country: String,
   reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review"
      }
   ]
});
listingSchema.post("findOneAndDelete", async (listings) =>{
   if(listings){
   await Review.deleteMany({ _id: { $in: listings.reviews } });
}
});

const Listing= mongoose.model("Listing", listingSchema);
module.exports=Listing;