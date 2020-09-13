const express = require('express')
const { usersignin, admin } = require('../middleware/authmiddleware')
const route = express.Router()
const Order = require('../model/order.model')
const Payment = require('../model/payment.model')
const fetch = require('node-fetch')

route.post('/create',usersignin,(req,res)=>{
    const{address, phone, product,total} = req.body
    let newPayment = new Payment({
        total
    })

    newPayment.save()
    .then(payment=>{
        let newOrder = new Order({
            user:req.user.userdetails._id,
            address,
            phone,
            product,
            timeline:[{status:"pending",note:"order created succesfully",date:Date.now()}],
            payment:payment._id
        })

        newOrder.save()
        .then(order=>{
            res.json({order})
        })
        .catch(err=>console.log(err))
        })    
    .catch(err=>console.log(err))
})  


route.get('/get',usersignin,(req,res)=>{
    Order.find({user:req.user.userdetails._id})
    .sort('-date')
    .populate('payment')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

route.get('/getall',usersignin,admin,(req,res)=>{
    Order.find()
    .sort('-date')
    .populate('payment')
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
    .populate('payment')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})


route.patch('/edit/:id',usersignin,admin,(req, res)=>{
    let {status,note} = req.body
    let timeline = {status, note}
    Order.findOneAndUpdate({_id:req.params.id},{$set:{status:status},$push:{timeline:timeline}},{new:true})
    .populate('product')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

route.put('/payment/:id',usersignin,admin,(req, res)=>{
    let {trx,status,total,paid,paymentStatus,confirmed} = req.body
    let payment 
    if(status){
        payment ={status}
    }else{
        payment ={transaction:trx,status:paymentStatus,total,paid,confirmed}
    }
    let timeline = {note:`${trx} submitted as trxId for amount ${paid}`}
    Order.findOneAndUpdate({_id:req.params.id},{$set:{payment:payment},$push:{timeline:timeline}},{new:true})
    .populate('product')
    .populate('user','userName')
    .then(order=>{
        res.json({order})
    })
    .catch(err=>console.log(err))
})

route.post('/ssl',(req, res)=>{
    const {val_id,amount,tran_id} = req.body
    fetch(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=testi5f57e2bc7027d&store_passwd=testi5f57e2bc7027d@ssl&format=jso`)
     .then(response => response.json())
     .then(result => {
       if(result.status == 'VALID'){
         Payment.findOneAndUpdate({_id:tran_id},{$set:{val_id:val_id},$inc:{paid:amount}},{new:true})
         .then(payment=>{
             let timeline = {
                 note: `${amount} BDT payment received successfully for id ${val_id}`
             }
            Order.findOneAndUpdate({payment:payment._id},{$push:{timeline:timeline}})
            .then(order=>{
                res.redirect("http://localhost:3000/orderlist")
            })
             
         })
       }else{
           res.redirect("http://localhost:3000/orderlist")
       }
     })
    
   
   })

module.exports = route