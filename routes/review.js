const express = require('express') ;
const router = express.Router({mergeParams:true}) ;
const catchAsync = require('../utils/catchAsync') ;
const ExpressError = require('../utils/ExpressError') ;
const {reviewSchema} = require('../schemas') ;
const Review = require('../models/review') ;
const Campground = require('../models/campground') ;


// validate review before supporting
const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(el=>el.message).join(',') ;
        throw new ExpressError(msg,404) ;
    }
    else{
        next() ;
    }
}

// to add reviews

router.post('/',validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    const review = new Review(req.body.review) ;
    campground.reviews.push(review) ;
    await review.save() ;
    await campground.save() ;
    console.log(campground) ;
    console.log(review) ;
    res.redirect(`/campground/${campground._id}`) ;
}))

// To delete review

router.delete('/:revId',catchAsync(async(req,res)=>{
    const{id,revId} = req.params ;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}}) ; // to delete object id of reviews from campground
    await Review.findByIdAndDelete(revId) ;
    res.redirect(`/campground/${id}`) ;
}))

module.exports = router ;