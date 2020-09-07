const express = require('express')
const route = express.Router()
const slugify = require('slugify')
const Brand = require('../model/brand.model')
const {usersignin, admin} = require('../middleware/authmiddleware')
const multer = require('multer')
const shortId = require('shortid')
const path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null,shortId.generate().replace(/_/g, "-") + '-' +  file.originalname )
    }
  })
   
  var upload = multer({ storage: storage })


route.post('/add',usersignin,admin,upload.single('brand'),(req, res)=>{
    const {name} = req.body
    const files = req.file

     let newbrand = new Brand({
         name,
         slug: slugify(name),
         image: files.filename
     })

     newbrand.save()
     .then(brand=>{
         res.status(200).json({brand})
     })
     .catch(err=>console.log(err))
})

route.get('/get',(req, res)=>{
    Brand.find()
    .then(brand=>{
        res.json({brand})
    })
    .catch(err=>console.log(err))
})

route.delete('/delete/:id',usersignin,admin,(req, res)=>{
  Brand.findByIdAndDelete(req.params.id)
  .then(brand=>{
    res.status(200).json({brand})
  })
  .catch(err=>console.log(err))
})


module.exports =route