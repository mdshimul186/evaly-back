const express = require('express')
const route = express.Router()
const Slider = require('../model/slider.model')
const { usersignin, admin } = require('../middleware/authmiddleware')
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
   
  // var upload = multer({ storage: storage })
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'slider',
      format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) =>shortId.generate()+'-'+file.originalname,
    },
  });

  const upload = multer({ storage: storage })
route.get('/get',(req, res)=>{
    Slider.find()
    .then(slider=>{
        res.status(200).json({slider})
    })
    .catch(err=>console.log(err))
})

route.post('/add',usersignin,admin,upload.single('slider'),(req, res)=>{
    const {caption} = req.body
    const file = req.file

    let newslider = new Slider({
        caption,
        image: file.path
    })

    newslider.save()
    .then(slider=>{
        res.status(200).json({slider})
    })
    .catch(err=>console.log(err))

})

route.delete('/delete/:id',usersignin,admin,(req, res)=>{
  Slider.findByIdAndDelete(req.params.id)
  .then(slider=>{
    res.status(200).json({slider})
  })
  .catch(err=>console.log(err))
})

route.post('/test',upload.single('slider'),(req, res)=>{
  
  res.json(req.file);

})


module.exports=route