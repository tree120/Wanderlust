const express=require("express");
const router=express.Router({mergeParams:true});
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)




router.post("/:id",async(req,res)=>{
  let {id} = req.params;
  const listing= await Listing.findById(id);
  console.log("Request Body:",req.body.booking);
  let {start_time,end_time} =req.body.booking;

  function calculate(startDate, endDate) {
    let start = new Date(startDate);
    let finish = new Date(endDate);
    let diff = finish - start ;
    const daysCount = Math.ceil(diff/(1000 * 60 * 60 *24));
    return daysCount;
    }
  let days = calculate(start_time,end_time);
  console.log(days);

  let originalImageUrl= listing.image.url;

  // const newBooking = new Booking({
  //   start_time,
  //   end_time,
  //   user:req.user._id,
  //   listing:listing._id,
  // });

  // let booking = await newBooking.save()
   
  res.render("listings/pay.ejs",{
    start_time,
    end_time,
    key: STRIPE_PUBLISHABLE_KEY,
    amount: (listing.price) * days,
    listing: listing._id,
    originalImageUrl,
     });
});






router.post("/pay/:id",async(req,res)=>{
  let {id} = req.params;
  let {start_time,end_time} =req.body.booking;

  // console.log(start_time);
  // console.log(end_time);
  const listing= await Listing.findById(id);
  if(!listing){
    return req.flash("error","Listing not found!!");
  }

  const newBooking = new Booking({
    start_time,
    end_time,
    user:req.user._id,
    listing:listing._id,
    status:"confirmed"
  });

 
   
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.user.username,
       
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount ,     // amount will be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then(async(charge) => {
      let savedBooking = await newBooking.save();
      req.flash("success","Booking confirmed!!");
      res.redirect("/trips");
  })
  .catch((err) => {
    req.flash("error","try again!!!");
      res.redirect("/listings");
  });

  });
 
router.put("/cancel/:id",async(req,res)=>{
  let {id} =req.params;
  let booking = await Booking.findByIdAndUpdate(id,{status:"canceled"});
  res.redirect("/trips");
});

router.delete("/delete/:id",async(req,res)=>{
  let {id} =req.params;
  await Booking.findByIdAndDelete(id);
  req.flash("success","Booking is Deleted!!")
  res.redirect("/trips");
});
  
  module.exports=router;