

const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();
    // Parse COOKIE_EXPIRE as an integer (milliseconds)
    const cookieExpire = parseInt(process.env.COOKIE_EXPIRE);
    if (isNaN(cookieExpire)) {
        console.error('Invalid COOKIE_EXPIRE value:', process.env.COOKIE_EXPIRE);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
      // Calculate expiration date based on current time + COOKIE_EXPIRE
    const expirationDate = new Date(Date.now() + cookieExpire);

      // options for cookie
    const options = {
        expires: expirationDate, // Set the expiration date
        httpOnly: true,
    };
  
      // Set the cookie and respond with user data and token
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user
    });
}
export default sendToken;


