const express = require('express');
require('dotenv').config();
const { UserModel } = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = express.Router();
const {decodeToken}=require('../middlewares/decodeToken.middleware')

userRouter.get('/profile',decodeToken, async(req,res)=>{
    // {
    //     userId: '6495b4db9ef9cb4d00fe5638',
    //     name: 'Shubham Adhya',
    //     iat: 1687606920
    // }
    const {userId}=req.userData
    try {
        const user=await UserModel.findById(userId)
        // console.log(user)
        res.status(200).json({
            msg:'Welcome Back',
            _id: user._id,
            name: user.name,
        })
    } catch (error) {
        console.log(error)
    }
})

userRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(202).json("User already exists, Please Login")
        }

        const hashedPass = bcrypt.hashSync(password, 5);
        const user = new UserModel({ email, name , password: hashedPass })
        user.save();
        jwt.sign({ userId: user._id, name }, process.env.JWT_secret, (err, token) => {
            if (err) {
                throw err
            } else {
                res.status(201).json({
                    msg:'User created successfully',
                    _id: user._id,
                    name: user.name,
                    token
                })
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong")
    }
})


userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json( "User not found" )
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            return res.status(401).json("Wrong Password")
        }

        jwt.sign({ userId: user._id, name:user.name }, process.env.JWT_secret, (err, token) => {
            if (err) {
                throw err
            } else {
                res.status(201).json({
                    msg:'Login Success',
                    _id: user._id,
                    name: user.name,
                    token
                })
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong")
    }
})


userRouter.post('/logout', async (req, res) => {
    res.json('logged out')
})

module.exports = {
    userRouter
}