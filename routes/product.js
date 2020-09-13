const express = require('express')
const { usersignin, admin } = require('../middleware/authmiddleware')
const route = express.Router()
const Product = require('../model/product.model')
const multer = require('multer')
const shortId = require('shortid')
const path = require('path')
const slugify = require('slugify')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, path.join(__dirname, '../uploads/'))
//     },
//     filename: function (req, file, cb) {
//       cb(null,shortId.generate().replace(/_/g, "-") + '-' +  file.originalname )
//     }
//   })

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'slider',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) =>shortId.generate()+'-'+file.originalname,
  },
});
   
  var upload = multer({ storage: storage })

  route.get('/recentproduct',(req, res)=>{
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10
    }
    Product.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
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
        imagearray.push(file.path)
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
  .populate('brand')
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.get('/category/:category',(req, res)=>{
  
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  }

  Product.find({category:req.params.category})
  .skip(pageOptions.page * pageOptions.limit)
  .limit(pageOptions.limit)
  .populate('category')
  .populate('brand')
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.get('/brand/:brand',(req, res)=>{
  Product.find({brand:req.params.brand})
  .populate('category')
  .populate('brand')
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
  Product.findOneAndUpdate({_id:req.params.id},{$set:{name,description,price,brand,discount}},{new:true})
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})

route.get('/search/:query',(req,res)=>{
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  }
  let sort = '-date'
 if(req.query.sortby){
    if(req.query.sortby == 'desc'){
      sort = '-price'
    }else if(req.query.sortby == 'asce'){
      sort = 'price'
    }
 }

  Product.find({name:{$regex:new RegExp(req.params.query, "i")}})
  .skip(pageOptions.page * pageOptions.limit)
  .limit(pageOptions.limit)
  .sort(sort)
  .populate('category')
  .populate('brand')
  .then(product=>{
    res.json({product})
  })
  .catch(err=>console.log(err))
})






module.exports = route