const express = require('express') ;
const router = express.Router({mergeParams:true}) ;
const catchAsync = require('../utils/catchAsync') ;
const ExpressError = require('../utils/ExpressError') ;
const {reviewSchema} = require('../schemas') ;
const Review = require('../models/review') ;
const Campground = require('../models/campground') ;
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware') ;

const review = require('../controllers/review') ;




router.post('/',isLoggedIn,validateReview,catchAsync(review.createReview)) ;


router.delete('/:revId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

module.exports = router ;