import mongoose from "mongoose";
const ThaterSchema = mongoose.Schema({
    theater : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    screens: [
        {
            screenNumber: {
                type: Number,
                required: true
            },
            seats: {
                type: Object,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
const Theater = mongoose.model('Theater',ThaterSchema);
export default Theater;