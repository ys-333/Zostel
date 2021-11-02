const express = require('express') ;
const router = express.Router() ;
const catchAsync = require('../utils/catchAsync') ;
const ExpressError = require('../utils/ExpressError') ;
const { campgroundSchema} = require('../schemas') ;
const Campground = require('../models/campground') ;
const multer  = require('multer') ;
const campground = require('../controllers/campground') ;
const {storage} = require('../cloudinary') ;
const upload = multer({storage}) ;



const {isLoggedIn,validateCampground,isAuthor} = require('../middleware') ;




router.get('/',catchAsync(campground.index)) ;

router.get('/new',isLoggedIn,campground.renderNewForm)
router.post('/',isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground));

//  TO SHOW THE PARTICULAR CAMP AND DETAIL RELATED TO IT.

router.get('/:id',catchAsync(campground.showCampground))

// to edit the given camp using its id
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),catchAsync(campground.updateCampground)) ;



router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campground.delete))

module.exports = router ;