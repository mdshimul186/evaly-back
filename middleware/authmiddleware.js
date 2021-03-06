const jwt = require('jsonwebtoken')
const usersignin = (req, res, next) =>{
    let token = req.headers.authorization
    if(token){
        var decoded = jwt.verify(token, 'secret')
        req.user = decoded
        next()

    }else{
        res.json({message: 'unauthorized'})
    }
}

const admin = (req, res, next) =>{
    let user = req.user
    if(user.role == 'admin'){
        next()
    }else{
        res.json({message: 'Admin required'})
    }
}
module.exports = {usersignin, admin}