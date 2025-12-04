const errorHandling = (err, req, res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.log(err.status, err.message);
    return res.status(status).json({
        success : false,
        message: message
    });
}

module.exports = errorHandling;