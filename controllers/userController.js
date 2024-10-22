import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from '../utils/jwtToken.js';

// Route handler for user registration
export const register = catchAsyncError(async (req, res, next) => {
    // Extract necessary information from the request body
    const { name, email, phone, role, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !phone || !role || !password) {
        return next(new ErrorHandler("Please fill the full registration form."));
    }

    // Check if the email already exists in the database
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("Email already exists!"));
    }

    // Create a new user in the database
    const user = await User.create({ name, email, phone, role, password });
    
    // Send token in response upon successful registration
    sendToken(user, 200, res, "User registered successfully");
});

// Route handler for user login
export const login = catchAsyncError(async (req, res, next) => {
    // Extract email, password, and role from the request body
    const { email, password, role } = req.body;

    // Check if email, password, and role are provided
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide email, password, and role.", 400));
    }

    // Find user by email in the database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    // Check if the provided password matches the stored password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password.", 400));
    }

    // Check if the user role matches the provided role
    if (user.role !== role) {
        return next(new ErrorHandler("User with this role not found!", 400));
    }

    // Send token in response upon successful login
    sendToken(user, 200, res, "User logged in successfully!");
});

// Route handler for user logout
export const logout = catchAsyncError(async (req, res, next) => {
    // Clear the token cookie and send a response indicating successful logout
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure:true,
        sameSite:"None",
    }).json({
        success: true,
        message: "User logged out successfully!",
    });
});

// Route handler for getuser
export const getUser = catchAsyncError((req, res, next) => {
    const user=req.user;
    res.status(200).json({
        success: true,
        user
    });
});