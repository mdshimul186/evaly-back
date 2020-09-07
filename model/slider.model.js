const mongoose = require('mongoose')

const sliderSchema = new mongoose.Schema({
    caption: {
        type: String,
        trim: true,
    },
    image:{
        type:String,
        required:true
    }
    
},{timestamps:true})


const Slider = mongoose.model('Slider', sliderSchema)
module.exports = Slider