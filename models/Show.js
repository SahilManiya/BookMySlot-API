import mongoose from "mongoose";
const ShowSchema = mongoose.Schema({
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
    screen : {
        type : String,
        required : true
    },
    dateAndTime : [
        {
            date : {
                type : String,
                required : true
            },
            time : {
                type : Object,
                required : true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
const Show = mongoose.model('Show',ShowSchema);
export default Show;