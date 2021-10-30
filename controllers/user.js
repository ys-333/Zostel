const User = require('../models/user') ;

module.exports.renderRegister = (req,res)=>{
    res.render('userAuth/register') ;
}

module.exports.register = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body ;
        const user = new User({username,email}) ;
        const registeredUser = await User.register(user,password) ;
        // console.log(registeredUser) ;
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

}

module.exports.renderLogin = (req,res)=>{
    res.render('userAuth/login') ;
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome Back') ;
    const redirectUrl  = req.session.returnTo || '/campground' ;
    delete req.session.returnTo ;
    res.redirect(redirectUrl) ;
}

module.exports.logout = (req,res)=>{
    req.logout() ;
    req.flash('success','GoodBye!') ;
    res.redirect('/campground') ;
}