const express= require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const { saveRedirectUrl} = require("../middleware.js")
const userController= require("../controllers/users.js");


router.get("/", async (req, res) => {

    const allListings = await Listing.find({});

    const groupedListings = {};

    allListings.forEach(listing => {
        if (!groupedListings[listing.location]) {
            groupedListings[listing.location] = [];
        }
        groupedListings[listing.location].push(listing);
    });

    const cityHeadlines = {
        Paris: "Popular homes in Paris",
        London: "Stay in London",
        Goa: "Explore Goa",
        Dubai: "Discover Dubai",
        Darjeeling: "Travel to Darjeeling",
        Puri: "Beach homes in Puri",
        Mumbai: "City life in Mumbai",
        Delhi: "Capital stays in Delhi",
        Kolkata: "Heritage homes in Kolkata"
    };

    res.render("listings/home", { groupedListings, cityHeadlines,query: req.query });

});

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))


router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login", failureFlash: true,
    }),
     userController.login);



router.get("/logout",userController.logout);

module.exports = router;
