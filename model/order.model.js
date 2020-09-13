const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    address: {
        type: String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }],
    status:{
        type:String,
        default:"pending"
    },
    payment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Payment'       
    },
    timeline:[{
        status:{type:String,default:"pending"},
        note:{type:String,default:"order created succesfully"},
        date:{
            type:Date,
            default: Date.now
        }

    }],
    date:{
        type:Date,
        default: Date.now
    }
    

})


const Order = mongoose.model('Order', orderSchema)
module.exports = Order