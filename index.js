import express from 'express';
const app = express();
import dotenv from 'dotenv';
import connectDatabace from './config/database.js';
import userRouter from './routers/user.js';
import errorMiddleware from './middlewere/error.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import movieRouter from './routers/movie.js';
import theaterRouter from './routers/theater.js';
import showRouter from './routers/show.js';
import bookingRouter from './routers/booking.js';
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';

dotenv.config({
    path : './.env' 
})

connectDatabace(); 

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles : true
}))
app.use('/user',userRouter);
app.use('/movie',movieRouter);
app.use('/theater',theaterRouter);
app.use('/show',showRouter);
app.use('/booking',bookingRouter);
app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log("Server not Connect");
        return false;
    }
    console.log("Server Connected",process.env.PORT);
})
app.use(errorMiddleware);