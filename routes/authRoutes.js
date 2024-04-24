const router = require("express").Router()
const e = require("express");
const {User} = require('../models/User')
const jwt = require('jsonwebtoken')

router.post('/', async(req,res)=>{
    let {email, password} = req.body;
    let user = await User.authUser(email, password)
    if(!user){
        res.status(401).send({error: "email or password not correct"})
        return
    }

    

    let token = jwt.sign({ username: user.username, _id: user._id},
                         process.env.TOKEN_KEY,
                         {expiresIn: 60 * 60} );
    
    
    res.send({token})
})


module.exports = router;