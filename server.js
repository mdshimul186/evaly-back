const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const path = require('path')


app.use(express.json())
app.use(cors())

app.use('/uploads',express.static(path.join(__dirname, '/uploads')))
app.use('/user', require('./routes/auth'))
app.use('/catagory', require('./routes/category'))
app.use('/product', require('./routes/product'))
app.use('/order', require('./routes/orders'))
app.use('/brand', require('./routes/brand'))
app.use('/slider', require('./routes/sliders'))
app.get('/',(req,res)=>{
    res.json({message:"works"})
})
mongoose.connect('mongodb://localhost:27017/ecommerce',{ useNewUrlParser: true ,useUnifiedTopology: true },()=>{
    console.log('DB connected');
})
app.listen(process.env.PORT || 5000,(req,res)=>{
    console.log('server started');
})