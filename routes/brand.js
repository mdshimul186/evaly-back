const express = require('express')
const route = express.Router()
const slugify = require('slugify')
const Brand = require('../model/brand.model')
const {usersignin, admin} = require('../middleware/authmiddleware')
const multer = require('multer')
const shortId = require('shortid')
const path = require('path')
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
    folder: 'Brands',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) =>shortId.generate()+'-'+file.originalname,
  },
});
   
  var upload = multer({ storage: storage })


route.post('/add',usersignin,admin,upload.single('brand'),(req, res)=>{
    const {name} = req.body
    const file = req.file

     let newbrand = new Brand({
         name,
         slug: slugify(name),
         image: file.path
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