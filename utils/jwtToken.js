// Function to send authentication token in response
export const sendToken = (user, statusCode, res, message) => {
    // Generate JWT token for the user
    const token = user.getJWTToken();
    
    // Options for setting cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure:true,
        sameSite:"None",
    };
    
    // Set cookie in response with JWT token
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token,
    });
};
