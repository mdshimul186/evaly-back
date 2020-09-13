const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({    
    val_id:{type:String, default:""},
    total:{type:Number},
    paid:{type:Number,default:0},
    
},{timestamps:true})


const Payment = mongoose.model('Payment', paymentSchema)
module.exports = Payment