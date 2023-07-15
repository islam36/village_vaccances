module.exports = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
        message,
        data
    })
}