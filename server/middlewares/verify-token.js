const jwt = require('jsonwebtoken')

module.exports = function(req , res , next) {

    //* we send these two key headers so that we can take the token
    let token = req.headers['x-access-token'] || req.headers['authorization']

    let checkBearer = "Bearer " 
    

    //* if token is exist we have a operation on it, if is not we send back a message with "No token Provided"
    if (token) {

        //* remove the bearer from token because in frontend sometime 'bearer' is start with token
        if (token.startsWith(checkBearer)) 
        {
        token = token.slice(checkBearer.length , token.length)
        }

        //* we verify the token with token and secret key and a callback
        jwt.verify(token , process.env.SECRET , (err , decoded) => {

            //* if token is not verify we send a message
            if (err) {
                res.json({
                    success: false,
                    message: "failed to authenticate"
                })
            }else {
                //* if token is verify we save decoded object to req.decoded
                req.decoded = decoded;
                next()
            }
        })
    } else {
        res.json({
            success: false,
            message: "No token Provided"
        })
    }
}