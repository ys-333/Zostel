const express = require('express') ;
const router = express.Router() ;
const catchAsync = require('../utils/catchAsync') ;
const User = require('../models/user') ;
const passport = require('passport') ;

router.get('/register',(req,res)=>{
    res.render('userAuth/register') ;
})

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const {username,email,password} = req.body ;
        const user = new User({username,email}) ;
        const registeredUser = await User.register(user,password) ;
        console.log(registeredUser) ;
        req.login(registeredUser,err=>{
            if(err) return next(err) ;
            req.flash('success','Welcome to Campground') ;
            res.redirect('/campground') ;
        })
        
    }
    catch(e){
        req.flash('error',e.message) ;
        res.redirect('/register') ;
    }

}))

router.get('/login',(req,res)=>{
    res.render('userAuth/login') ;
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back') ;
    const redirectUrl  = req.session.returnTo || '/campground' ;
    delete req.session.returnTo ;
    res.redirect(redirectUrl) ;
})

router.get('/logout',(req,res)=>{
    req.logout() ;
    req.flash('success','GoodBye!') ;
    res.redirect('/campground') ;
})






module.exports = router ;