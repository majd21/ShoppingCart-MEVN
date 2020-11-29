const router = require('express').Router()
const User = require('../models/user')
const verifyToken = require('../middlewares/verify-token')

const jwt = require('jsonwebtoken')
const user = require('../models/user')

//* SignUp route
router.post('/auth/signup' , async (req ,res) => {
    //* if user enter password or email or not
    if (!req.body.email || !req.body.password) {
        res.json({
            success: false ,
            message: 'please enter email or password!!'
        })
    } else {
        try {
            //* craete a user
            let newUser = new User()
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = req.body.password
            await newUser.save()
            //* save user to a token and encrypted user
            let token = jwt.sign(newUser.toJSON() , process.env.SECRET , {
                expiresIn: 604800 //* 1 week
            })

            res.json({
                success: true,
                token,
                message: 'Successfully created a new user'
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: err.message
            })
        }
    }
})


//* Profile route
//* get user 
router.get('/auth/user',verifyToken , async (req , res) => {
    try {
        let foundUser = await User.findOne({_id: req.decoded._id })
        if (foundUser) {
            res.json({
                success: true,
                user: foundUser
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

//* update a profile
router.put('/auth/user' , verifyToken , async (req , res) => {
    try {
        let foundUser = await User.findOne({_id: req.decoded._id})
        if(foundUser) {
            if (req.body.name) foundUser.name = req.body.name
            if (req.body.email) foundUser.email = req.body.email
            if (req.body.password) foundUser.password = req.body.password

            await foundUser.save()
            res.json({
                success: true,
                message: 'Successfully Updated'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

//* login route
router.post('/auth/login' , async (req , res) => {
    try {

        //* we check if email exist or not
        let foundUser = await User.findOne({email: req.body.email})

        //* if not exist we send a error
        if (!foundUser) {
            res.status(403).json({
                success: false,
                message: 'Authentication failed , User not found'
            })
        } else {
            //* if is exist we check the password
            if(foundUser.comparePassword(req.body.password)) {
                //* we wrap user object in a token
                let token = jwt.sign(foundUser.toJSON() , process.env.SECRET , {
                    expiresIn: 604800 //* 1 week
                })
                //* we response that token
                res.json({
                    success: true ,
                    token: token
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Authentication failed, Wrong password'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})


module.exports = router