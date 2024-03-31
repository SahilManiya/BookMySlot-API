import Movie from "../models/Movie.js";
import Theater from "../models/Theater.js";
import catchAsyncError from "../middlewere/catchAsyncError.js";
import ErrorHandler from '../utils/errorhandler.js';
import ApiFeatures from '../utils/apiFeatures.js';

export const createTheater = catchAsyncError(async(req,res,next)=>{
    const findTheater = await Theater.findOne({theater :req.body.theater});

    if(findTheater){
        return next(new ErrorHandler("This Thaeater Already Added...",400));
    }

    const create = await Theater.create(req.body);

    if(!create){
        return next(new ErrorHandler("Theater Data not Create...",400));
    }

    return res.status(201).json({
        success : true,
        create
    })

})

// Find Theater By Movie
export const AvailableTheater = catchAsyncError(async(req,res,next)=>{
    const resultPerPage = 10;
    
    let query = Theater.find();

    const filterSearch = new ApiFeatures(query, req.query);
    filterSearch.search().filter().pagination(resultPerPage);

    const theaters = await filterSearch.query.select('-__v');
    const totalProducts = await Theater.countDocuments(filterSearch.query);

    const totalPages = Math.ceil(totalProducts / resultPerPage);

    return res.json({
        success: true,
        theaters,
        ResultPerPage: resultPerPage,
        totalPages
    });
    
})

//Update Theater By Admin
export const updateTheater = catchAsyncError(async(req,res,next)=>{

    const findTheater = await Theater.findById(req.params.id);

    if(!findTheater){
        return next(new ErrorHandler("That theater Not Added...",400));
    }

    const TheaterUpdate = await Theater.findByIdAndUpdate(findTheater,req.body);
    
    if(!TheaterUpdate){
        return next(new ErrorHandler("Theater data not Update Try Again...",400));
    }

    const updated = await Theater.findById(findTheater);
    return res.json({
        success : true,
        TheaterUpdate : updated
    })
})