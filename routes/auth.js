const express = require('express')
const route = express.Router()
const User = require('../model/auth.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

route.post('/register', (req, res)=>{
    const {firstName, lastName, email, password, userName, role} = req.body

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, (err, hash)=>{
            const newUser = new User({
                firstName, lastName, email, password : hash, userName, role
            })

            newUser.save()
            .then(user=>{
                res.status(200).json({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                })
            })
            .catch(err=>console.log(err))
        
        })
    })
    
    
})


route.post('/login', (req,res)=>{
    const {email, password} = req.body
    User.findOne({email})
    .then(user=>{
        if(!user) return res.json({message: 'user not found'})
        bcrypt.compare(password, user.password,(err, pass)=>{
            if(err) return res.json({message: 'invalid password'})
           if(pass){
            var userdetails = {
                _id:user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
            var token = jwt.sign({ userdetails, role: user.role }, 'secret');
            
            res.json({token, user:userdetails})
            
           }else{
            res.json({message: 'invalid password'})
           }

        })
    })
    .catch(err=>console.log(err))
})

module.exports = route