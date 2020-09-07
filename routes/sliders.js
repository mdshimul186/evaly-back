const express = require('express')
const route = express.Router()
const Slider = require('../model/slider.model')
const { usersignin, admin } = require('../middleware/authmiddleware')
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

route.get('/get',(req, res)=>{
    Slider.find()
    .then(slider=>{
        res.status(200).json({slider})
    })
    .catch(err=>console.log(err))
})

route.post('/add',usersignin,admin,upload.single('slider'),(req, res)=>{
    const {caption} = req.body
    const files = req.file

    let newslider = new Slider({
        caption,
        image: files.filename
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

module.exports=route