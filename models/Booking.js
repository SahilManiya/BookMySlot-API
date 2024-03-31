import mongoose from "mongoose";
const BookingSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    movie : {
        type : mongoose.Schema.ObjectId,
        ref : 'Movie',
        required : true
    },
    theater : {
        type : mongoose.Schema.ObjectId,
        ref : 'Theater',
        required : true
    },
    show : {
        type : mongoose.Schema.ObjectId,
        ref : 'Show',
        required : true
    },
    time : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    seat : {
        type : Object,
        required : true
    },
    screen : {
        type : Number,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
const Booking = mongoose.model('Booking',BookingSchema);
export default Booking;