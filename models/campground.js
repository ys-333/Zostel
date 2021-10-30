//const { application } = require('express');
const mongoose = require('mongoose') ;
// const { campgroundSchema } = require('../schemas');
const Review = require('./review') ;

const Schema = mongoose.Schema ;

const CampgoundSChema = new Schema({
    title: String ,
    image: String,
    price: Number,
    description:String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review' 
        }
    ]
}) ;

/**
 * this is to ensure that when we delete campground all tweet associated with it shoudl be deleted
 */

CampgoundSChema.post('findOneAndDelete',async (camp)=>{
    if(camp){
        await Review.deleteMany({$_id:{$in:camp.reviews}}) 
    }
})
//this model will be used in app.js so we need to export it

module.exports = mongoose.model('Campground',CampgoundSChema) ;