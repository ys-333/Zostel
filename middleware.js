module.exports.isLoggedIn = (req,res,next)=>{
    // console.log("User....",req.user) ;
    // console.log(req.path,req.originalUrl) ;
    if(!req.isAuthenticated()){
        
        req.flash('error','You must be signed in!') ;
        return res.redirect('/login') ;
    }
    next() ;
}