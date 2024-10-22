// Custom error class for handling errors with status code
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Middleware to handle errors
export const errorMiddleware = (err, req, res, next) => {
    // Set default error message and status code if not provided
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
    // Handle specific error types and customize error message and status code
    if (err.name === "CaseError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired, try again`;
        err = new ErrorHandler(message, 400);
    }
    
    // Send error response with appropriate status code and message
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;
