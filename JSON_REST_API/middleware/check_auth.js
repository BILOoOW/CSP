const jwt = require('jsonwebtoken');
const express_jwt = require('express-jwt');
const blacklist = require('express-jwt-blacklist');

module.exports = (req, res, next) => {
       try{
        express_jwt({
            secret: 'secret',
            isRevoked: blacklist.isRevoked
            // if(blacklist.isRevoked === true){
            //     return res.status(401).json({
            //         message:"shit"
            //     });
            // }
            });
       const token = req.headers.authorization.split(" ")[1];
    //    console.log(token);
       const decoded = jwt.verify(token, process.env.JWT_KEY);
       req.userData = decoded;
       next();
       } catch (error) {
           return res.status(401).json({
               message:"Auth failed"
           });
       }
};