const jwtoken = require('jsonwebtoken');
// middleware to verify the token
const verifyToken = (req,res,next)=>{
    console.log("inside verifyToken:" + req.headers.token)
    const authHeader = req.headers.token
    if(authHeader) 
    {
        // verify the 'token' from the header
        jwtoken.verify(authHeader.split(' ')[1],process.env.JWTKEY,
            // this is the callback
            // it will return an 'err' or a data 
            // in this case we call it 'user'
            (err,user)=>{
                // error will happen when the token is not valid, return the message and the error body
                if(err)
                {
                    return res.status(403).json({vtoken:"Invalid Token!",error:err});
                }
                // token is valid send back the user as the request
                req.user = user;
                // exit the verifyToken function and continue the request by calling next();
                next();
            }
        )
    }else
    {
        return res.status(401).json("Invalid request!");
    }
}

const verifyTokenAuthorization = (req,res,next) => {
    console.log("-- inside verifyTokenAuthorization --")
    verifyToken(req,res,()=>{
        // check if the user.id passed by the verifyToken middleware
        // is the same as the id in the request parameter
        console.log("user data:");
        console.log(req.user)
        console.log("params");
        console.log(req.params)
        if(req.user.id === req.params.id || req.user.isAdmin) 
        {
            // verification success move on to the next part of the req
            next();
        }else
        {
            return res.status(403).json("Unauthorized request detected!");
        }
    })
}

module.exports = { verifyToken,verifyTokenAuthorization };