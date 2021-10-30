const express = require('express') ;
const router = express.Router() ;
const catchAsync = require('../utils/catchAsync') ;
const User = require('../models/user') ;
const passport = require('passport') ;


const user =  require('../controllers/user') ;

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login)

router.get('/logout',user.logout)






module.exports = router ;