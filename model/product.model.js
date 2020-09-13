const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:true
    },
    slug:{
        type: String,
        unique:true
    },
    description:{
        type:String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    discount:{
        type:Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },
    productImg:[{
        type:String
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    review:[{
        user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        body: String
    }],
    date: {
        type:Date,
        default: Date.now
    }
    

})


const Product = mongoose.model('Product', productSchema)
module.exports = Product