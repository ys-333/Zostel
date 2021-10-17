const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground') ;
const methodOverride = require('method-override') ;
const ejsMate = require('ejs-mate') ;
const catchAsync = require('./utils/catchAsync') ;
const ExpressError = require('./utils/ExpressError') ;
//const Joi = require('Joi') ;
const { campgroundSchema } = require('./schemas') ;

mongoose.connect('mongodb://localhost:27017/Hostel',{
    useNewUrlParser:true, // basically if we find bug in new url parser than we refer back to old url parser
    useUnifiedTopology:true
    // so these are basically to deal with deprication warning
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
}); // this is to validate mongoo side error 

const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true})) ;// this is used so that req.body in post is not empty
app.use(methodOverride('_method')) ;// as in from it support post and get,so to use put and delete we have to use method-override


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

app.get('/campground',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({}) ;
    res.render('campground/index',{campgrounds}) ;
}))

//So here it is to create new campground

app.get('/campground/new',(req,res)=>{
    res.render('campground/new') ;
})

app.post('/campground',validateCampground,catchAsync(async(req,res,next)=>{
    // res.send(req.body) ;
    //if(!req.body.campground) throw new ExpressError('Validate Data',404) ;
    const campground = new Campground(req.body.campground) ;
    await campground.save() ;
    res.redirect(`/campground/${campground._id}`); 
    
  
}));

//  TO SHOW THE PARTICULAR CAMP AND DETAIL RELATED TO IT.

app.get('/campground/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    res.render('campground/show',{campground}) ;
}))

// to edit the given camp using its id
app.get('/campground/:id/edit',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    res.render('campground/edit',{campground}) ;
}))
app.put('/campground/:id',catchAsync(async (req,res)=>{
   const {id} = req.params ;
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground}) ;
   res.redirect(`/campground/${campground._id}`) ;
})) ;

// To delete camp
/*app.get('/campground/:id/delete',async(req,res)=>{
    const campground = await Campground.findById(req.params.id) ;
    res.render('/campground/delete',{campground}) ;
})*/


app.delete('/campground/:id',catchAsync(async (req,res)=>{
    const {id} = req.params ;
    await Campground.findByIdAndDelete(id,{... req.body.campground}) ;
    res.redirect(`/campground`) ;
}))


// If req that is made does not looKalike any url

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404)) ;
})

// middleware to handle error

app.use((err,req,res,next)=>{
    const {statusCode=500} = err ;
    if(!err.message) err.message = 'Something Went Wrong' ;
    res.status(statusCode).render('error',{err}) ;
})


app.listen(3000, () => {
    console.log("Listening on portal 3000");
})