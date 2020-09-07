const express = require('express')
const { usersignin, admin } = require('../middleware/authmiddleware')
const route = express.Router()
const Order = require('../model/order.model')

route.post('/create',usersignin,(req,res)=>{
    const{address, phone, product} = req.body
    let newOrder = new Order({
        user:req.user.userdetails._id,
        address,
        phone,
        product,
        timeline:[{status:"pending",note:"order created succesfully",date:Date.now()}]
    })
    newOrder.save()
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})


route.get('/get',usersignin,(req,res)=>{
    Order.find({user:req.user.userdetails._id})
    .sort('-date')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

route.get('/getall',usersignin,admin,(req,res)=>{
    Order.find()
    .sort('-date')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

route.get('/:orderId',usersignin,(req, res)=>{
    let id = req.params.orderId
    Order.findById(id)
    .populate('product')
    .populate('user','userName')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})


route.patch('/edit/:id',usersignin,admin,(req, res)=>{
    let {status,note,paymentStatus,trx} = req.body
    let timeline = {status, note}
    let payment = {status:paymentStatus,transaction:trx}
    Order.findOneAndUpdate({_id:req.params.id},{$set:{status:status,payment:payment},$push:{timeline:timeline}},{new:true})
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

route.put('/payment/:id',usersignin,admin,(req, res)=>{
    let {trx,status} = req.body
    let payment 
    if(status){
        payment ={status}
    }else{
        payment ={transaction:trx,status:'unpaid'}
    }
    let timeline = {note:`${trx} submitted as trxId`}
    Order.findOneAndUpdate({_id:req.params.id},{$set:{payment:payment},$push:{timeline:timeline}},{new:true})
    .populate('product')
    .populate('user','userName')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

module.exports = route