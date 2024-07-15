const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn,isReviewauthor} =require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//post review
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
   //delete review
router.delete("/:reviewId",isLoggedIn,isReviewauthor,wrapAsync(reviewController.deleteReview));

module.exports=router;