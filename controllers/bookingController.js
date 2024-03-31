import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Theater from "../models/Theater.js";
import Booking from "../models/Booking.js";
import catchAsyncError from "../middlewere/catchAsyncError.js";
import ErrorHandler from '../utils/errorhandler.js';
import Show from "../models/Show.js";
import nodemailer from "nodemailer";


export const bookMyTicket = catchAsyncError(async(req,res,next)=>{
    const findShow = await Show.findById(req.body.show);
    // console.log(findShow);
    const findTheater = await Theater.findById(findShow.theater);
    if(!findShow){
        return next(new ErrorHandler("This show not Exist...",400));
    }
    // console.log(findTheater);
    const times = Object.values(findShow.dateAndTime[0].time);

    // find show in time
    if(!times.includes(req.body.time)){
        return next(new ErrorHandler(`${req.body.time} This time That selected Show not Available...`,400));
    }
    // Find Seat with Section like A,B,C with Screen In Theater 
    const theaterSeats = Object.values(findTheater.screens.filter(v=>{
        return v.screenNumber.toString() === findShow.screen.toString();
    }));
    
    const theaterSection = Object.keys(theaterSeats[0].seats);

    const bodySeats =  Object.keys(req.body.seat);

    const allElementsPresent = bodySeats.every(element => theaterSection.includes(element)); 
    
    if(allElementsPresent == false){
        return next(new ErrorHandler(`Seat ${bodySeats} not Available in ${findTheater.theater} Theater...`,400));
    }

    const seat = req.body.seat;
    
    // console.log(Object.values(seat));
    function checkCategorySeats(category) {
        
        const requestedSeats = seat[category];
        const availableSeats = theaterSeats[0].seats[category];
        
        return requestedSeats.every(value => value <= availableSeats);
    }
    const isSeatsAvailable = {};

    Object.keys(seat).forEach(category => {
        // console.log(category);
        isSeatsAvailable[category] = checkCategorySeats(category);
    });

    if(Object.values(isSeatsAvailable).includes(false) ){
        return next(new ErrorHandler("Seat not Available..",400));
    }
    
    // req.body.seat with Section Select Two times Error
    function checkSeat(arrays) {
        for (let key in arrays) {

            const array = arrays[key];
            const set = new Set(array);
            if (set.size !== array.length) {
                return true;
            }
        }
        return false;
    }
    if (checkSeat(seat)) {
        return next(new ErrorHandler("Seat Already Selected",400));
    }

    let seatArrays = [];
    let minLength = [];
    // console.log(req.body.seat);
    // req.body.seat length 0 Error && Two section seats merge in on Array
    for (const key in req.body.seat) {
        const v = req.body.seat[key];
        minLength = minLength.concat(v);
        const formattedArray = v.map(element => `${key}${element}`);
        seatArrays = seatArrays.concat(formattedArray);
    }
    req.body.user = req.user.id;
    req.body.movie = findShow.movie;
    req.body.theater = findShow.theater;
    req.body.date = findShow.dateAndTime[0].date;
    req.body.screen = findShow.screen;
    for(let i=0; i<minLength.length;i++){
        if(minLength[i]<=0){
            return next(new ErrorHandler("Seat not Available..",400));
        }
    }

    // find Booking With theater With date&time with Section and Seat
    const findBooking = await Booking.find({theater:findShow.theater,date:findShow.dateAndTime[0].date,time:req.body.time});
    
    try {

        for (const v of findBooking) {
            for (const section in v.seat) {
                // console.log("Section",section);
                for (const seatNumber of v.seat[section]) {
                    // console.log("seatNumber",seatNumber);
                    if (req.body.seat[section] && req.body.seat[section].includes(seatNumber)) {
                        return next(new ErrorHandler(`Seat ${seatNumber} in section ${section} is already booked.`, 400));
                    }
                }
            }
        }
        const bookTicket = await Booking.create(req.body);
        const findMovie = await Movie.findById(findShow.movie); 
        if (bookTicket) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMPT_HOST,
                port: process.env.SMPT_PORT,
                secure: true,
                auth: {
                    user: process.env.SMPT_MAIL,
                    pass: process.env.SMPT_PASSWORD,
                },
            });
            const info = await transporter.sendMail({
                from: process.env.SMPT_MAIL, // sender address
                to: req.user.email, // list of receivers
                subject: "Your Tickets are Booked ✔", // Subject line
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333;">Your Tickets are Booked</h2>
                        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px;">
                            <p><strong>Movie:</strong> ${findMovie.movie}</p>
                            <p><strong>Theater:</strong> ${findTheater.theater}</p>
                            <p><strong>Screen:</strong> ${bookTicket.screen}</p>
                            <p><strong>Seat no:</strong> ${seatArrays}</p>
                            <p><strong>Show Time:</strong> ${bookTicket.time}</p>
                            <p><strong>Date:</strong> ${bookTicket.date}</p>
                            <img src="${findMovie.avatar.url}" style="max-width: 100px height : 120px;" />
                            <p>Thank you for booking with us!</p>
                        </div>
                    </div>
                `,
            });   
        }
        return res.status(201).json({
            success : true,
            message : `Your Ticket Booked check ${req.user.email} This mail`,
            bookTicket
        });
    } 
    catch (error) {
        return next(error);
    }

})

// export const bookMyTicket = catchAsyncError(async(req,res,next)=>{
//     const findTheater = await Theater.findById(req.params.id);  

//     if(!findTheater){
//         return next(new ErrorHandler("Theater not Available...",400));
//     }

//     const findShow = await Show.find({theater:findTheater.id});

//     req.body.theater = findTheater.id;
//     req.body.user = req.user.id;
    
//     if(!findShow){
//         return next(new ErrorHandler("Show not Available in this Theater...",400));
//     }

//     // console.log(findShow);
//     const record = findShow.filter((v,i)=>{
//         const stringId = v.movie.toString();
//         // console.log("movie id",stringId);
//         // console.log("Req.body",req.body.movie);
//         if(stringId == req.body.movie){
//             return v;
//         }
//     })
   
//     if(!record){
//         return next(new ErrorHandler("Record not Found...",400));
//     }
//     record.filter((v,i)=>{
//         req.body.date = v.dateAndTime[0].date;
//     })
  
//     function getTimeObjectFromRecord(record) {
//         if (Array.isArray(record) && record.length > 0) {
          
//             const firstElement = record[0];

//             if (Array.isArray(firstElement.dateAndTime) && firstElement.dateAndTime.length > 0) {
//                 return firstElement.dateAndTime[0].time;
//             }
//         }
//         return null;
//     }

//     const timeObject = getTimeObjectFromRecord(record);
//     // console.log(timeObject);
//     const timeToFind = req.body.time;
//     // console.log(timeToFind);
//     const foundTime = Object.values(timeObject).find(value => value === timeToFind);

//     if (!foundTime) {
//         return next(new ErrorHandler("This time not Available for This show...", 400));
//     } 
//     findTheater.screens.filter((v,i)=>{
//         req.body.screen = v.screenNumber;
//     })
//     const seatArrays = [];

//     for (const key in req.body.seat) {
//         if (Object.hasOwnProperty.call(req.body.seat, key)) {
//             const values = req.body.seat[key];
//             values.forEach(value => {
//                 seatArrays.push(value); 
//             });
//         }
//     }
    
//     const bookTicket = await Booking.create(req.body);
//     if(bookTicket){
//         const findMovie = await Movie.findById(req.body.movie);
//         // console.log(findMovie);
//         // console.log(bookTicket.scrren);
//         // console.log(findTheater.theater);
//         const transporter = nodemailer.createTransport({
//             host: process.env.SMPT_HOST,
//             port: process.env.SMPT_PORT,
//             secure: true,
//             auth: {
//                 // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//                 user: process.env.SMPT_MAIL,
//                 pass: process.env.SMPT_PASSWORD,
//             },
//         });
//         const info = await transporter.sendMail({
//             from: process.env.SMPT_MAIL, // sender address
//             to: req.user.email, // list of receivers
//             subject: "Your Tickets are Booked ✔", // Subject line
//             text: "Hello world?", // plain text body
//             html: `<h3>Your Tickets are Booked</h3>
//             <p><strong>Movie:</strong> ${findMovie.movie}</p>
//             <p><strong>Theater:</strong> ${findTheater.theater}</p>
//             <p><strong>Screen:</strong> ${bookTicket.screen}</p>
//             <p><strong>Seat no:</strong> ${seatArrays}</p>
//             <p><strong>Show Time:</strong> ${bookTicket.time}</p>
//             <p><strong>Date:</strong> ${bookTicket.date}</p>
//             <p>Thank you for booking with us!</p>`, // html body
//         });
//     }
//     return res.status(201).json({
//         success : true,
//         message : `Your Ticket Booked check ${req.user.email} This mail`,
//         bookTicket
//     })

// })

export const getAllTicket = catchAsyncError(async(req,res,next)=>{
    const findTicket = await Booking.find().select('-__v').populate('movie theater','-__v -screens').exec();

    if(!findTicket){
        return next(new ErrorHandler("Tickets not found",400));
    }

    return res.json({
        success : true,
        findTicket
    })
})

export const cancelTicket = catchAsyncError(async(req,res,next)=>{
    const findBooking = await Booking.findById(req.params.id);

    if(!findBooking){
        return next(new ErrorHandler("Ticket not booked...",400));
    }

    if(findBooking.user.toString() !== req.user.id.toString()){
        return next(new ErrorHandler("This ticket not Booking you...",400));
    }

    const cancel = await Booking.findByIdAndDelete(findBooking);

    if(!cancel){
        return next(new ErrorHandler("Ticket not Cancel try again...",400));
    }

    return res.json({
        success : true,
        cancel
    })
})