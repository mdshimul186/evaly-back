const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:true
    },
    slug:{
        type: String,
        unique:true
    },
    parentId: {
        type: String
    }
    

})


const Catagory = mongoose.model('Category', categorySchema)
module.exports = Catagory