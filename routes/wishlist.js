const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

// Add to wishlist
router.post("/:id", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(listing._id)) {
        user.wishlist.push(listing._id);
    }

    await user.save();
    res.json({ success: true });
});

// Remove from wishlist
router.delete("/:id", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== req.params.id
    );

    await user.save();
    res.json({ success: true });
});

// Show wishlist page
router.get("/", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.render("listings/wishlist.ejs", { wishlist: user.wishlist });
});

module.exports = router;