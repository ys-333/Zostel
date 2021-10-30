const express = require('express') ;
const router = express.Router() ;
const catchAsync = require('../utils/catchAsync') ;
const ExpressError = require('../utils/ExpressError') ;
const { campgroundSchema} = require('../schemas') ;
const Campground = require('../models/campground') ;
const campground = require('../controllers/campground') ;
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



const {isLoggedIn,validateCampground,isAuthor} = require('../middleware') ;




router.get('/',catchAsync(campground.index)) ;

router.get('/new',isLoggedIn,campground.renderNewForm)
//router.post('/',isLoggedIn,validateCampground,catchAsync(campground.createCampground));
router.post('/',upload.single('image'),(req,res)=>{
    console.log(req.body,req.file) ;
    res.send('Hope everything works') ;
})

//  TO SHOW THE PARTICULAR CAMP AND DETAIL RELATED TO IT.

router.get('/:id',catchAsync(campground.showCampground))

// to edit the given camp using its id
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))
router.put('/:id',isLoggedIn,isAuthor,catchAsync(campground.updateCampground)) ;



router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campground.delete))

module.exports = router ;