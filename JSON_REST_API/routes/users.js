const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('..\\models\\user');
const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const express_jwt = require('express-jwt');
// const blacklist = require('express-jwt-blacklist');
// const bcrypt = require('bcrypt-nodejs');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email already exists'
                })
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: req.body.password 
                });
                user.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message:'User Created',
                        createdUser: user
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error:err
                    });
                });
            }
    });
    // bcrypt.hash(req.body.password,10,(err, hash) => {
    //     if(err){
    //         return res.status(500).json({           
    //             error:err
    //         });
    //     } else {
            

    //     }
    // });
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
        else if(user[0].password === req.body.password){
            const token = jwt.sign(
            {
                email: user[0].email,
                userId: user[0].id
            }, 
            process.env.JWT_KEY, 
            // "secret",
            {
                expiresIn: '1h'
            }
            );
            return res.status(200).json({
                message: 'Authorization successful',
                token: token
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.get('/logout', (req, res, next)=>{
    // blacklist.revoke(req.user);
    // res.status(200).json({
    //     message: 'Successfully logout'
    // });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        console.log(result),
        res.status(200).json({
            message:"User deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;