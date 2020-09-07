const express = require('express')
const route = express.Router()
const slugify = require('slugify')
const Category = require('../model/category.model')
const {usersignin, admin} = require('../middleware/authmiddleware')

function createCat(cat, parentId = null){
    let categorylist = []
    let category
    if(parentId == null){
        category = cat.filter(cat=>cat.parentId == undefined)
    }else{
        category = cat.filter(cat=>cat.parentId == parentId)
    }

    for(let cate of category){
        categorylist.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            children: createCat(cat, cate._id)
        })
    }
    return categorylist
}

route.post('/create',usersignin,admin, (req, res)=>{
    const {name, parentId} = req.body
    let catobj = new Category({
        name,
        slug: slugify(name)
    })

    if(parentId){
        catobj.parentId = parentId
    }

    catobj.save()
    .then(cat=>{
        res.json({cat})
    })
    .catch(err=>console.log(err))
})

route.get('/',(req, res)=>{
    Category.find()
    .then(cat=>{
        let catlist = createCat(cat)
         res.json({catlist})
    })
    .catch(err=>console.log(err))
})


module.exports =route