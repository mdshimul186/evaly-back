const express = require('express')
const { usersignin, admin } = require('../middleware/authmiddleware')
const route = express.Router()
const Product = require('../model/product.model')
const multer = require('multer')
const shortId = require('shortid')
const path = require('path')
const slugify = require('slugify')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null,shortId.generate().replace(/_/g, "-") + '-' +  file.originalname )
    }
  })
   
  var upload = multer({ storage: storage })

  route.get('/recentproduct',(req, res)=>{
    Product.find()
    .sort('-date')
    .then(product=>{
      res.json({product})
    })
    .catch(err=>console.log(err))
  })

route.post('/add',usersignin,admin,upload.array('productImg'),(req, res)=>{
    const {name, description, price, discount, category, review, brand} = req.body
    let imagearray = []
    req.files.map(file=>{
        imagearray.push(file.filename)
    })
    let newProduct = new Product({
        name,slug:slugify(name), description, price, discount, category,brand, review, createdBy: req.user._id, productImg:imagearray
    })

    newProduct.save()
    .then(product=>{
        res.json({product})
    })
    .catch(err=>res.status(400).json({message: "something went wrong"}))
})

route.get('/:id',(req, res)=>{
  console.log(req.params.id);
  Product.findById(req.params.id)
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.get('/category/:category',(req, res)=>{
  Product.find({category:req.params.category})
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.get('/brand/:brand',(req, res)=>{
  Product.find({brand:req.params.brand})
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})


route.delete('/delete/:id',usersignin,admin,(req, res)=>{
  Product.findByIdAndDelete(req.params.id)
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.patch('/update/:id',usersignin,admin,(req, res)=>{
  const {name, description, price, discount, category, review, brand} = req.body
  Product.findOneAndUpdate({_id:req.params.id},{$set:{name,description,price,brand}},{new:true})
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.get('/search/:query',(req,res)=>{
  Product.find({name:{$regex:new RegExp(req.params.query, "i")}})
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})






module.exports = route