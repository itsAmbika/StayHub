const express= require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router=express.Router({mergeParams: true});
const ExpressError=require("../utils/ExpressError.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//review route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Successfully made a new review!");
    res.redirect(`/listings/${id}`);
}));
//delete review route
router.delete("/:reviewId",isLoggedIn,
    isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/listings/${id}`);
}));
module.exports=router;