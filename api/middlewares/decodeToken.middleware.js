const jwt = require('jsonwebtoken')
require('dotenv').config();

async function decodeToken(req,res,next){
    const token= req.headers.authorization?.split(' ')[1];

    if(token){
        jwt.verify(token, process.env.JWT_secret, (err, decoded)=>{
            if(err) throw err;
            // res.status(200).json(decoded)
            req.userData=decoded
        })
        next()
    }else{
        res.status(403).json("provide jwt token")
    }
}
 module.exports={
    decodeToken
 }