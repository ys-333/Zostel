const express = require('express') ;
const router = express.Router() ;
const catchAsync = require('../utils/catchAsync') ;
const ExpressError = require('../utils/ExpressError') ;
const { campgroundSchema} = require('../schemas') ;
const Campground = require('../models/campground') ;





// validdate campground on server side
const validateCampground = (req,res,next)=>{
    
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

router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({}) ;
    res.render('campground/index',{campgrounds}) ;
}))

//So here it is to create new campground

router.get('/new',(req,res)=>{
    res.render('campground/new') ;
})

router.post('/',validateCampground,catchAsync(async(req,res,next)=>{
    // res.send(req.body) ;
    //if(!req.body.campground) throw new ExpressError('Validate Data',404) ;
    const campground = new Campground(req.body.campground) ;
    await campground.save() ;
    res.redirect(`/campground/${campground._id}`); 
    
  
}));

//  TO SHOW THE PARTICULAR CAMP AND DETAIL RELATED TO IT.

router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews') ;
    res.render('campground/show',{campground}) ;
}))

// to edit the given camp using its id
router.get('/:id/edit',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    res.render('campground/edit',{campground}) ;
}))
router.put('/:id',catchAsync(async (req,res)=>{
   const {id} = req.params ;
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground}) ;
   res.redirect(`/campground/${campground._id}`) ;
})) ;

// To delete camp
/*router.get('/campground/:id/delete',async(req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    res.render('/campground/delete',{campground}) ;
})*/


router.delete('/:id',catchAsync(async (req,res)=>{
    const {id} = req.params ;
    await Campground.findByIdAndDelete(id) ;
    res.redirect(`/campground`) ;
}))

module.exports = router ;