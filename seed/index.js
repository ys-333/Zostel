// this seed is directly connected to database

const mongoose = require('mongoose') ;
const camp = require('../models/campground') ;
const cities = require('./cities') ;
const{descriptors,places} = require('./seedhelper') ;

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


//this is an example


/*const createCampground = async ()=>{
    await camp.deleteMany({}) ;
    const Camp = new camp({title:"Sonarpur"}) ;
    await Camp.save() ;
}*/

const sample = array=> array[Math.floor(Math.random()*array.length)] ;

const seedDb = async()=>{
    await camp.deleteMany({}) ;
    for(let i=1;i<=50;i++){
        const random1000 = Math.floor(Math.random()*1000) ;
        const price = Math.floor(Math.random()*20)+10 ;
        const Camp = new camp({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)},${sample(places)}` ,
             image:'https://source.unsplash.com/collection/483251',
            //image:'https://images.unsplash.com/photo-1623966849598-dd847d702ea5?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDh8NnNNVmpUTFNrZVF8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dicta, officiis voluptate incidunt libero vero dignissimos quis atque voluptatum quo enim quod nam, ab provident tempore a molestias facere quia.',
            price
        }) ;
        await Camp.save() ;
    }
    
}

seedDb().then(()=>{
    console.log("Exiting") ;
    mongoose.connection.close() ;
})

// createCampground().then(()=>{
//     mongoose.connection.close() ;
//     // the purpose of above statement is to exit the database
// })