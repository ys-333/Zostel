const Campground = require('../models/campground')  ;
const Review = require('../models/review') ;  

module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    const review = new Review(req.body.review) ;
    review.author = req.user._id;
    campground.reviews.push(review) ;
    await review.save() ;
    await campground.save() ;
    req.flash('success','Review created successfully!') ;
    res.redirect(`/campground/${campground._id}`) ;
}

module.exports.deleteReview = async(req,res)=>{
    const{id,revId} = req.params ;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}}) ; // to delete object id of reviews from campground
    await Review.findByIdAndDelete(revId) ;
    req.flash('success','Successfully deleted review!') ;
    res.redirect(`/campground/${id}`) ;
}