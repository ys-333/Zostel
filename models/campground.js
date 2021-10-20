//const { application } = require('express');
const mongoose = require('mongoose') ;

const Schema = mongoose.Schema ;

const CampgoundSChema = new Schema({
    title: String ,
    image: String,
    price: Number,
    description:String,
    location: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review' 
        }
    ]
}) ;

//this model will be used in app.js so we need to export it

module.exports = mongoose.model('Campground',CampgoundSChema) ;