const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
// dotenv.config({
//     path: '../.env'
// });
console.log("inside db.js")
//console.log(process.env.MONGO_URL)

const connectDB =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log('Database Connected!'));
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports =connectDB
