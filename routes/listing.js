const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn ,isOwner,validateListing}=require("../middleware.js");
const listingControler = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingControler.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingControler.createListing));

router.get("/search",listingControler.showDestination);

router.get("/filter",listingControler.filterDestination);

router.get("/book/:id",isLoggedIn,listingControler.renderBookingForm);
  
router.get("/new",isLoggedIn, listingControler.renderNewform);

router.route("/:id")
.get(wrapAsync(listingControler.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]')
    ,validateListing, wrapAsync(listingControler.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingControler.destroyListing));


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControler.renderEditform));  


  

module.exports=router;