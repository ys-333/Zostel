const { string } = require('joi');
const mongoose = require('mongoose') ;
const Review = require('./review') ;

const Schema = mongoose.Schema ;

const ImageSchema = new Schema({
    url:String,
    filename:String
}) ;


ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200') ;
})

const CampgoundSChema = new Schema({
    title: String ,
    images:[ImageSchema],
    price: Number,
    geometry: {
        type: {
          type: String,
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
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
});

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