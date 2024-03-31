import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Theater from "../models/Theater.js";
import catchAsyncError from "../middlewere/catchAsyncError.js";
import ErrorHandler from '../utils/errorhandler.js';
import ApiFeatures from "../utils/apiFeatures.js";

export const createShow = catchAsyncError(async(req,res,next)=>{
    
    const findTheater = await Theater.findById(req.params.id);
    // console.log(findTheater.screens[0]);

    const findTheaterinShow = await Show.find({theater : req.params.id});
    if(!findTheater){
        return next(new ErrorHandler("That theater not Available...",400));
    }
    //find Screen in theater with date&time
    const theaterScreen = findTheaterinShow.filter(v => {
        return v.screen.toString() === req.body.screen.toString();
    });

    const theaterAlreadyBooked = theaterScreen.some(v => {
        // console.log(v.dateAndTime);
        return v.dateAndTime[0].date === req.body.dateAndTime[0].date;
    });
    
    if (theaterAlreadyBooked) {
        return next(new ErrorHandler(`This theater In this Date Show in Screen ${req.body.screen} Already Booked...`, 400));
    }

    // find theater in Screen not Exist..
    if (!findTheater.screens.some(screen => screen.screenNumber === req.body.screen)) {
        return next(new ErrorHandler(`${findTheater.theater} Theater in Screen ${req.body.screen} not Available...`, 400));
    }

    req.body.theater = findTheater.id;
    
    const findMovie = await Movie.findById(req.body.movie);

    // console.log(findMovie.id);
    if(!findMovie){
        return next(new ErrorHandler("that Movie not Available...",400));
    }
    req.body.movie = findMovie.id;
    
    const createShow = await Show.create(req.body);

    // populate and create
    const populate = await Show.findOne({_id:createShow.id}).populate('movie').exec();

    if(!createShow){
        return next(new ErrorHandler("Show not Create try Again...",400))
    }
    return res.status(201).json({
        success : true,
        createShow : populate
    })
})

export const findShow = catchAsyncError(async(req,res,next)=>{
    const resultPerPage = 10;
    
    let query = Show.find();

    const filterSearch = new ApiFeatures(query, req.query);
    filterSearch.search().filter().pagination(resultPerPage);

    query = query.populate({ path: 'movie theater', select: '-__v -screens' });

    const shows = await filterSearch.query.select('-__v');
    // console.log(shows);
    const totalProducts = await Show.countDocuments(filterSearch.query);

    const totalPages = Math.ceil(totalProducts / resultPerPage);

    return res.json({
        success: true,
        shows,
        ResultPerPage: resultPerPage,
        totalPages
    });

    // const resultPerPage = 10;

    // let query =  Show.find();
    
    // const filterSearch = new ApiFeatures(query, req.query);
    // filterSearch.search().filter().pagination(resultPerPage);
    
    // query = query.populate({ path: 'movie', select: '-__v' });
    
    // const shows = await filterSearch.query.select('-__v');
    // const totalProducts = await Show.countDocuments(filterSearch.query);
    
    // const totalPages = Math.ceil(totalProducts / resultPerPage);
    
    // return res.json({
    //     success: true,
    //     shows,
    //     ResultPerPage: resultPerPage,
    //     totalPages
    // });

})