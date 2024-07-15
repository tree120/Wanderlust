const User = require("../models/user");
const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.signUpPage = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req, res)=> {
    try{
        let { username, email ,password}= req.body;
        const newUser= new User({email, username});
        const registeredUser=await User.register(newUser,password);             
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }    
};

module.exports.loginPage = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 };

 module.exports.logout = (req,res,next)=>{
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};

module.exports.help = (req,res)=>{
    res.render("users/help.ejs");
};

module.exports.trip = async(req,res)=>{
    let user=req.user._id;
    const bookings =await Booking.find({user:user}).populate("user").populate("listing");
    res.render("users/trips.ejs",{bookings});
};

module.exports.admin = async(req,res)=>{
    const listings = await Listing.find({owner:req.user._id}).select('_id');
    let user = req.user._id;
    const listingIds = listings.map(listing => listing._id);
    const bookings =await Booking.find({listing:{$in:listingIds}}).populate("user").populate("listing");
    res.render("users/admin.ejs",{bookings, user});
};

module.exports.manage =async(req,res)=>{
    const allListings = await Listing.find({owner:req.user._id});
    res.render("users/manage.ejs",{allListings});

}

module.exports.homepage = async(req,res)=>{
    res.render("users/adminHomepage");
}

