const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn}=require("../middleware.js");
const passport =require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usersController = require("../controllers/users.js");

router.route("/signup")
.get(usersController.signUpPage)
.post( wrapAsync(usersController.signUp));

router.route("/login")
.get(usersController.loginPage)
.post(saveRedirectUrl,
passport.authenticate("local",
{failureRedirect: "/login", failureFlash:true}),
usersController.login);

router.get("/logout",usersController.logout);
router.get("/help",usersController.help);
router.get("/trips",isLoggedIn,usersController.trip);
router.get("/adminHomepage",isLoggedIn,usersController.homepage);
router.get("/admin",isLoggedIn,usersController.admin);
router.get("/manage",isLoggedIn,usersController.manage);
module.exports=router;