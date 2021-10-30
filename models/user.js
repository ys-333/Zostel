const mongoose = require('mongoose') ;
const passportLocalMongoose = require('passport-local-mongoose') ;
const schema = mongoose.Schema ;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        

    }
})

userSchema.plugin(passportLocalMongoose) ;

module.exports = mongoose.model('User',userSchema) ;