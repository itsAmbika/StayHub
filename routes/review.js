const express= require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router=express.Router({mergeParams: true});
const ExpressError=require("../utils/ExpressError.js");
const reviewController=require("../controllers/reviews.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewId",isLoggedIn,
    isReviewAuthor, wrapAsync(reviewController.deleteReview));
module.exports=router;