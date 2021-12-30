if(process.env.NODE_ENV!='production'){
    require('dotenv').config() ;
}

// console.log(process.env.CLOUDINARY_API_KEY) ;
// console.log(process.env.CLOUDINARY_CLOUD_NAME) ;

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground') ;
const methodOverride = require('method-override') ;
const ejsMate = require('ejs-mate') ;
const catchAsync = require('./utils/catchAsync') ;
const ExpressError = require('./utils/ExpressError') ;
//const Joi = require('Joi') ;
const { campgroundSchema,reviewSchema} = require('./schemas') ;
const Review = require('./models/review');
const session = require('express-session') ;
const flash = require('connect-flash') ;
const User = require('./models/user') ;
const passport = require('passport') ;
const LocalStrategy = require('passport-local') ;
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet') ;
const MongoDBStore = require("connect-mongo");

const app = express();

const userRoutes = require('./routes/userAuth') ;
const campgroundRoutes = require('./routes/campground') ;
const reviewRoutes = require('./routes/review') ;
const { date } = require('joi');


//const dbUrl = process.env.DB_URL ; we need during production
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl,{
    useNewUrlParser:true, // basically if we find bug in new url parser than we refer back to old url parser
    useUnifiedTopology:true,
    
    // so these are basically to deal with deprication warning
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
}); // this is to validate mongoo side error 





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true})) ;// this is used so that req.body in post is not empty
app.use(methodOverride('_method')) ;// as in from it support post and get,so to use put and delete we have to use method-override
app.use(express.static(path.join(__dirname,'public'))) ;
app.use(mongoSanitize({
    replaceWith:'_'
}));

app.use(helmet({
    contentSecurityPolicy:false 
})) ;

//session configuration
//const secret = process.env.SECRET ;


// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })
const secret = process.env.SECRET || 'thisismysecret' ;

const sessionConfig = {
    store:MongoDBStore.create({ 
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60
    }),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite:None,
        secure:true
    }
}



app.use(session(sessionConfig)) ;
app.use(flash()) ;

app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.use(new LocalStrategy(User.authenticate())) ;

passport.serializeUser(User.serializeUser()) ;
passport.deserializeUser(User.deserializeUser()) ;

app.use((req,res,next)=>{
    console.log(req.query) ;
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl ;
    }
    //console.log(req.session) ;
    res.locals.user = req.user ;
    res.locals.success = req.flash('success') ;
    res.locals.error = req.flash('error') ;
    next() ;
})

// Routes 

app.use('/',userRoutes) ;
app.use('/campground',campgroundRoutes) ;
app.use('/campground/:id/review',reviewRoutes) ;







app.engine('ejs',ejsMate) ;

app.get('/', (req, res) => {
    //res.send("Hello from Zostel")
    res.render('home');
})

/*app.get('/makeCampground',async (req,res)=>{
    const campground = new Campground({title:"mYRoom",description:"FunWorkPlace"}) ;
    await campground.save() ;
    res.send(campground) ;
})*/




// If req that is made does not match any of route

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404)) ;
})

// middleware to handle error

app.use((err,req,res,next)=>{
    const {statusCode=500} = err ;
    if(!err.message) err.message = 'Something Went Wrong' ;
    res.status(statusCode).render('error',{err}) ;
})

const port = process.env.PORT||3000 ;

app.listen(port, () => {
    console.log(`Listening on Portal ${port}`);
})