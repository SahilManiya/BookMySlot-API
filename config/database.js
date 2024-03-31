import mongoose from "mongoose";
const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    })
    .then(() => {
        console.log("DB Was Connected...");
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err);
    });
}
// console.log("MongoDB URI:", process.env.MONGO_URI);
export default connectDatabase;
