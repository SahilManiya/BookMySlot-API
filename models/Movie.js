import mongoose from "mongoose";

const MovieSchema = mongoose.Schema({
    movie : {
        type : String,
        required : true
    },
    avatar : {
        public_id : {
            type :String,
            required : true
        },
        url : {
            type :String,
            required : true
        }
    },
    tempfile : {
        type : String,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
const Movie = mongoose.model('Movie',MovieSchema);
export default Movie;