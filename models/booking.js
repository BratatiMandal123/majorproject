const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    paymentMethod: String,
    phone: String,

    // NEW FIELDS
    status: {
        type: String,
        enum: ["pending", "confirmed", "expired", "cancelled"],
        default: "pending"
    },
    expiresAt: Date
});

module.exports = mongoose.model("Booking", bookingSchema);