const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
.then((res)=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) =>({...obj,owner:"6631eb92afa1d874ce22d181"}));
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}

initDB();