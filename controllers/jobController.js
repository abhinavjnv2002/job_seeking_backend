import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

// Route handler to get all jobs
export const getAllJobs = catchAsyncError(async (req, res, next) => {
    // Find all jobs where 'expired' is false
    const jobs = await Job.find({ expired: false });

    // Send response with the retrieved jobs
    res.status(200).json({
        success: true,
        jobs,
    });
});

// Route handler to post a new job
export const postJob = catchAsyncError(async (req, res, next) => {
    // Extract user's role from request
    const { role } = req.user;

    // Check if the user role is 'job seeker'; if so, deny access
    if (role === "job seeker") {
        return next(new ErrorHandler("job seeker is not allowed to access this resource!", 400));
    }

    // Extract job details from request body
    const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

    // Check if all required job details are provided
    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide full job details", 400));
    }

    // Check if either fixed salary or salary range is provided
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(new ErrorHandler("Please provide fixed salary or salary range!"));
    }

    // Check if both fixed salary and salary range are provided
    if (salaryFrom && salaryTo && fixedSalary) {
        return next(new ErrorHandler("Cannot enter both fixed salary and salary range together!"));
    }

    // Extract the user ID of the job poster
    const postedBy = req.user._id;

    // Create a new job record in the database
    const job = await Job.create({
        title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo, postedBy
    });

    // Send response with success message and the newly created job
    res.status(200).json({
        success: true,
        message: "Job posted successfully!",
        job,
    });
});

// Route handler to get jobs posted by the current user
export const getmyJobs = catchAsyncError(async (req, res, next) => {
    // Extract user's role from request
    const { role } = req.user;
    
    // Check if the user role is 'job seeker'; if so, deny access
    if (role === "job seeker") {
        return next(new ErrorHandler("job seeker is not allowed to access this resource!", 400));
    }
    
    // Find jobs posted by the current user
    const myJobs = await Job.find({ postedBy: req.user._id });
    
    // Send response with the retrieved jobs
    res.status(200).json({
        success: true,
        myJobs,
    });
});

// Route handler to update a job
export const updateJob = catchAsyncError(async (req, res, next) => {
    // Extract user's role from request
    const { role } = req.user;
    
    // Check if the user role is 'job seeker'; if so, deny access
    if (role === "job seeker") {
        return next(new ErrorHandler("job seeker is not allowed to access this resource!", 400));
    }

    // Extract job ID from request parameters
    const { id } = req.params;

    // Find the job by its ID
    let job = await Job.findById(id);

    // If job not found, return an error
    if (!job) {
        return next(new ErrorHandler("Oops, Job not found!", 400));
    }

    // Update the job with the provided data
    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    // Send response with success message and the updated job
    res.status(200).json({
        success: true,
        job,
        message: "Job Updated Successfully!"
    });
});

// Route handler to delete a job
export const deleteJob = catchAsyncError(async (req, res, next) => {
    // Extract user's role from request
    const { role } = req.user;
    
    // Check if the user role is 'job seeker'; if so, deny access
    if (role === "job seeker") {
        return next(new ErrorHandler("job seeker is not allowed to access this resource!", 400));
    }

    // Extract job ID from request parameters
    const { id } = req.params;

    // Find the job by its ID
    const job = await Job.findById(id);

    // If job not found, return an error
    if (!job) {
        return next(new ErrorHandler("Job not found!", 404));
    }

    // Delete the job
    await job.deleteOne();

    // Send response with success message
    res.status(200).json({
        success: true,
        message: "Job deleted successfully!",
    });
});

export const getSingleJob = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);

        if (!job) {
            return next(new ErrorHandler("Job Not Found!", 404));
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        return next(new ErrorHandler("Invalid ID/CastError", 400));
    }
});
