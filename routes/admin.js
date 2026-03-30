const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const { isLoggedIn, isAdmin } = require("../middleware");

// Admin Dashboard
router.get("/bookings", isLoggedIn, isAdmin, async (req, res) => {

    const { status } = req.query;

    // Filter condition
    let filter = {};
    if (status) {
        filter.status = status;
    }

    const bookings = await Booking.find(filter)
        .populate("listing")
        .populate("user");

    // 📊 Stats
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });

    const revenueData = await Booking.aggregate([
        { $match: { status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.render("admin/bookings", {
        bookings,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        totalRevenue
    });
});

router.get("/analytics", isLoggedIn, isAdmin, async (req, res) => {

    const data = await Booking.aggregate([
        { $match: { status: "confirmed" } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$totalPrice" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Convert to arrays for chart
    const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const labels = data.map(d => monthNames[d._id - 1]);
    const revenues = data.map(d => d.revenue);

    res.render("admin/analytics", { labels, revenues });
});

router.post("/bookings/:id/cancel", isLoggedIn, isAdmin, async (req, res) => {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/admin/bookings");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled by admin!");
    res.redirect("/admin/bookings");
});

module.exports = router;