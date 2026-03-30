const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");



// Show payment page
router.get("/payment/:id", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const { bookingId, checkIn, checkOut, totalPrice } = req.query;

    
    const booking = await Booking.findById(bookingId);
    console.log("Query params:", req.query);  // <-- check if bookingId is coming
    console.log("Booking found:", booking);   // <-- check if MongoDB returned a booking

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    res.render("bookings/payment.ejs", {
        listing,
        checkIn,
        checkOut,
        totalPrice,
        booking
    });
});


// Confirm payment
router.post("/confirm", isLoggedIn, async (req, res) => {

    console.log("🔥 Confirm route hit");
    console.log("Form data:", req.body);

    const { listingId, paymentMethod, phone, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    console.log("Fetched booking:", booking);

    // Check booking validity
    if (!booking || booking.status !== "pending") {
        console.log("❌ Invalid booking or already processed");
        req.flash("error", "⛔ Booking has expired or is invalid!");
        return res.redirect(`/listings/${listingId}`);
    }

    // Update booking
    booking.status = "confirmed";
    booking.paymentMethod = paymentMethod;
    booking.phone = phone;

    booking.expiresAt = null;


    await booking.save();

    console.log("✅ Booking confirmed:", booking);

    req.flash("success", "Payment Successful 🎉");
    res.redirect("/bookings");
});

// Show all bookings of logged-in user
router.get("/", isLoggedIn, async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id,
        status: "confirmed"   // ✅ ONLY show paid bookings
    }).populate("listing");

    res.render("bookings/index", { bookings });
});

// Create pending booking (before payment)
router.post("/:id", isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        const { checkIn, checkOut, phone, paymentMethod } = req.body;

        // Check for any pending booking by this user for this listing
        const existingPending = await Booking.findOne({
            listing: listing._id,
            user: req.user._id,
            status: 'pending'
        });

        if (existingPending) {
            req.flash("error", "You already have a pending booking for this listing!");
            return res.redirect(`/listings/${listing._id}`);
        }

        // Check if booking exists for these dates (confirmed bookings only)
        const existingBooking = await Booking.findOne({
            listing: listing._id,
            status: {$in:['pending', 'confirmed']}, // ✅ consider pending too to prevent double booking
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) }
        });

        if (existingBooking) {
            req.flash("error", "This listing is already booked for the selected dates!");
            return res.redirect(`/listings/${listing._id}`);
        }

        // Calculate total price
        const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
        const totalPrice = days * listing.price;

        // Set expiration 15 minutes from now
        const expireMinutes = 15;
        const expiresAt = new Date(Date.now() + expireMinutes * 60000);

        const pendingBooking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn,
            checkOut,
            totalPrice,
            phone,
            paymentMethod,
            status: 'pending',
            expiresAt
        });

        await pendingBooking.save();
        console.log("Pending Booking ID:", pendingBooking._id); // <-- log the saved booking ID

        req.flash("success", "Booking created! Complete payment within 15 minutes.");
        res.redirect(`/bookings/payment/${listing._id}?bookingId=${pendingBooking._id}&checkIn=${checkIn}&checkOut=${checkOut}&totalPrice=${totalPrice}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect(`/listings/${req.params.id}`);
    }
});


// Cancel booking
router.delete("/:id", isLoggedIn, async (req, res) => {

    await Booking.findByIdAndDelete(req.params.id);

    req.flash("success", "Booking cancelled successfully!");
    res.redirect("/bookings");

});



module.exports = router;