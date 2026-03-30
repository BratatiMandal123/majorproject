const Listing = require("../models/listing.js");
const User = require("../models/user.js");



module.exports.index = async (req, res) => {

    let filter = {};

    const { search } = req.query;

    // 🔍 SEARCH (navbar)
    if (search) {
        filter.location = new RegExp(search, "i");
    }

    // 🌍 City filter
    if(req.query.city && req.query.city !== "All"){
        filter.location = req.query.city;
    }

    // 💰 Price filter
    if(req.query.maxPrice){
        filter.price = { $lte: parseInt(req.query.maxPrice) };
    }

    // 🛏 Nights filter
    if(req.query.nights){
        if(req.query.nights === "1"){
            filter.price = { ...filter.price, $lte: 3000 };
        } 
        else if(req.query.nights === "2"){
            filter.price = { ...filter.price, $lte: 6000 };
        }
    }

    const allListings = await Listing.find(filter);

    // 📦 Group by city
    const groupedListings = {};

    allListings.forEach(listing => {
        if(!groupedListings[listing.location]){
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

    let wishlistIds = [];

    if(req.user){
        const user = await User.findById(req.user._id);
        wishlistIds = user.wishlist.map(id => id.toString());
    }

    res.render("listings/home.ejs", { 
        groupedListings, 
        cityHeadlines,
        wishlistIds,
        query:req.query
    });
};

module.exports.renderNewForm=  (req,res)=>{
    res.render("listings/new.ejs");
    
};
module.exports.showListing = async (req,res)=>{
    let { id }= req.params;
    const listing = await Listing.findById(id)
    .populate({ path:"reviews",
         populate:{ 
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
         req.flash("error", "Listing you requested for does not exits!");
         return res.redirect("/listings");
    }

    
    res.render("listings/show.ejs",{listing});
};

const axios = require("axios");

module.exports.createListing = async (req,res,next)=>{

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    try{
        const geoData = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.listing.location}&key=${process.env.GOOGLE_MAP_KEY}`
        );

        const coords = geoData.data.results[0]?.geometry?.location;

        if(coords){
            newListing.geometry = {
                lat: coords.lat,
                lng: coords.lng
            };
        }

    }catch(err){
        console.log("Geocoding failed:", err.message);
    }

    await newListing.save();

    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};



module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error", "Listing you requested for does not exits!");
         res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};
module.exports.updateListing= async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
    let url= req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing= async(req,res)=>{
    let {id}= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted");
    res.redirect("/listings");
};