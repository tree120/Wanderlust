const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const User = require("./user.js");
const Listing = require("./listing.js");
const { date, required } = require("joi");


const bookingSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    listing:{
        type:Schema.Types.ObjectId,
        ref:"Listing"
    },
    start_time:{
        type:Date,
        default:Date.now,
    } ,
    end_time:{
        type:Date,
        default:Date.now,
    },
    status:{
        type:String
    },
});

module.exports = mongoose.model("Booking",bookingSchema);