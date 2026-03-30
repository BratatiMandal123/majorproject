const Booking = require('../models/booking');

async function expirePendingBookings() {
    try {
        const now = new Date();
        const result = await Booking.updateMany(
            { status: 'pending', expiresAt: { $lte: now } },
            { status: 'expired' }
        );

        if (result.modifiedCount > 0) {
            console.log(`[${new Date().toLocaleTimeString()}] Expired ${result.modifiedCount} pending bookings`);
        }
    } catch (err) {
        console.error("Error expiring bookings:", err);
    }
}

module.exports = expirePendingBookings;