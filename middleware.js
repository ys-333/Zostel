const {campgroundSchema,reviewSchema} = require('./schemas') ;
const ExpressError = require('./utils/ExpressError') ;
const Campground = require('./models/campground') ;
const Review  = require('./models/review') ;



module.exports.isLoggedIn = (req,res,next)=>{
    // console.log("User....",req.user) ;
    // console.log(req.path,req.originalUrl) ;
    if(!req.isAuthenticated()){
        
        req.flash('error','You must be signed in!') ;
        return res.redirect('/login') ;
    }
    next() ;
}

// campground middlware

module.exports.validateCampground = (req,res,next)=>{
    
    //console.log(campgrondSchema) ;
    const {error} = campgroundSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(el=>el.message).join(',') ;
        throw new ExpressError(msg,400) ;
    }
    else{
        next() ;
    }
}


// validate review before supporting
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body) ;
    if(error){
        const msg = error.details.map(el=>el.message).join(',') ;
        throw new ExpressError(msg,404) ;
    }
    else{
        next() ;
    }
}



module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params ;
    const camp = await Campground.findById(id) ;
    if(!camp.author.equals(req.user._id)){
       req.flash('error',"You don't have permission!") ;
       return res.redirect(`/campground/${id}`) ;
    }
    next() ;
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,revId} = req.params ;
    const review = await Review.findById(revId) ;
    console.log('*********************') ;
    console.log(req.user._id) ;
    console.log(review.author) ;
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You can't delete other review") ;
        return res.redirect(`/campground/${id}`) ;
    }
    next() ;
}