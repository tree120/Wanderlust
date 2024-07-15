const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)


module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.showDestination = async(req,res)=>{
  let {place} = req.query;
  //console.log(place);
  const allListings= await Listing.find(
    {country:`${place}`});
  //console.log(allListings.length);
  if(allListings.length <= 0){
    req.flash("error","Listing does not exist!!");
    res.redirect("/listings");
  }else{
    res.render("listings/index.ejs",{allListings});
  }
  
 // console.log(allListings);
};
module.exports.filterDestination = async(req,res)=>{
  const category = req.query.category;
  //const allListings= await Listing.find({category:{$in:[category]}});
  const allListings= await Listing.find({category:`${category}`});
  //console.log(allListings.length);
  if(allListings.length <= 0){
    req.flash("error","Listing does not exist!!");
    res.redirect("/listings");
  }else{
    res.render("listings/index.ejs",{allListings});
  }
};

module.exports.renderBookingForm = async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id).
    populate({path:"reviews",populate:{
      path:"author"
    },}).populate("owner");
    let originalImageUrl= listing.image.url;
    
  res.render("listings/booking.ejs",{
    listing, originalImageUrl
     });
};

module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).
    populate({path:"reviews",populate:{
      path:"author"
    },}).populate("owner");
    if(!listing){
      req.flash("error","Listing does not exist!!");
      res.redirect("/listings");
    }else{
      res.render("listings/show.ejs",{listing});
    }
  };
  
module.exports.createListing = async (req, res) => {
  let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();

    let url =req.file.path;
    let filename =req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={filename,url};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing =await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing is created!!")
    res.redirect("/listings");
};

module.exports.renderEditform=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing does not exist!!");
      res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_200,w_200/e_blur:300");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
  };

module.exports.updateListing = async (req,res)=>{
  let {id}=req.params;
  console.log(req.body.listing.status);
  const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();
    
      listing.geometry = response.body.features[0].geometry;
      console.log(listing.geometry);
      
    if(typeof req.file !== "undefined"){
      let url =req.file.path;
      let filename =req.file.filename;
      listing.image = {filename,url};
    }
    await listing.save();
    req.flash("success"," Listing is Updated!!")
    res.redirect(`/listings/${id}`);
  };



module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!!")
  //console.log(deletedListing);
    res.redirect("/listings");
};