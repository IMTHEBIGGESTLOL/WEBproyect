const router = require("express").Router()
const users = require('../data/usersdata.json')
const {User} = require('../models/User')
const auth = require('../middleware/auth')
//const {nanoid} = require('nanoid')
const fs = require('fs')

// console.log(users);
router.get('/', auth.validateHeader, auth.validateAdmin, async (req,res)=>{
    console.log(req.query);
    // console.log(req.get('x-auth'));
    // let token = req.get('x-auth')
    // let admin = false;
    // if(token == '23423')
    //     admin = true;

    let filters = {}

    
    //let filteredUsers = users.slice()
    
    //console.log(filteredUsers);
    let {name, email, minId, maxId, pageSize, pageNumber} = req.query;
    console.log(name, email);

    if(name){
        filters.name = new RegExp(name, 'i'); // /name/i
    }

    let filteredUsers = await User.findUsers(filters, req.admin, 5,1);

    // if(name){
    //     filteredUsers = filteredUsers.filter(u => 
    //                 u.name.toUpperCase().includes(name.toUpperCase())
    //                 )
    // }

    // if(email){
    //     filteredUsers = filteredUsers.filter(u => 
    //                 u.email.toUpperCase().includes(email.toUpperCase())
    //                 )
    // }
    // if(minId){
    //     filteredUsers = filteredUsers.filter(u => u.id >= minId)
    // }
    // if(maxId){
    //     filteredUsers = filteredUsers.filter(u => u.id <= maxId)
    // }

    // pageSize = pageSize? pageSize: 3

    res.send(filteredUsers)
})



router.get('/:_id', async (req, res)=>{
    console.log(req.params.id);
    let user = await User.findUserById(req.params._id)
    if (!user){
        res.status(404).send({error: "User not found"})
        return;
    }
    res.send(user)
})


// this will never be reached
router.get('/email/:email', async (req, res)=>{
    console.log(req.params.email);
    let user = await User.findUser(req.params.email);
    if (!user){
        res.status(404).send({error: "User not found"})
        return;
    }
    res.send(user)
})


router.post('/', async (req,res)=>{
    console.log(req.body);
    
    let {email} = req.body.email;
    //let user = users.find(u => u.email == email)
    let user = await User.findUser(email)
    if(user){
        res.status(400).send({error: 'User exists'})
        return 
    }

    if (req.body.userPhoto == ""){
        delete req.body.userPhoto;
    }
    
    let userObj = req.body;

    let newUser = await User.saveUser(userObj)
    //users.push(userObj)
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )

    res.status(201).send(newUser)
    return
    

    // let error = ''
    // if(name == undefined || !name.trim())
    //     error += 'name is invalid;'
    // if(email == undefined || !email.trim())
    //     error += 'email is invalid'

    // res.status(400).send({error})

})


//updating an existent object
router.put('/email/:email', async (req,res)=>{
    //search for the id
    let user = await User.findUser(req.params.email);

    //if not found 
    if (!user){
        // return 404 not found 
        res.status(404).send({error: 'User not found'})
        return
    }
       
    //if found
        // update data z
    // let {name, email} = req.body;

    // if(!name || !email) {
    //     res.status(400).send({error: 'name or email are not valid'})
    //     return
    // }
    
    let updateUser = await User.updateUser(user.email, req.body);
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send(updateUser)

        
})

router.delete('/email/:email', auth.validateHeader, auth.requireAdmin, async (req, res)=>{
    // search for the id
    let pos= await User.deleteUser(req.params.email)
    
    // if not found return 404
    if(!pos){
        res.status(404).send({error: 'User not found'})
        return
    }

    
    res.send({pos})
})

// POST /api/users/:userId/reviews/subscribe
router.post('/:userId/reviews/subscribe', auth.validateHeader, auth.validateUser ,async (req, res) => {
    try {
        const userId = req.params.userId;
        let user = await User.findUser(req.token);
        const subscriberId = user._id; // ID del usuario autenticado

        // Agregar el ID del usuario a seguir a la lista de suscripciones del usuario actual
        await User.findByIdAndUpdate(subscriberId, { $addToSet: { reviewsubscriptions: userId } });

        res.status(200).send("Usuario suscrito a las reseñas correctamente.");
    } catch (error) {
        res.status(500).send("Error al suscribirse a las reseñas: " + error.message);
    }
});

// DELETE /api/users/:userId/reviews/subscribe
router.delete('/:userId/reviews/subscribe', auth.validateHeader, auth.validateUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        let user = await User.findUser(req.token);
        const subscriberId = user._id; // ID del usuario autenticado

        // Eliminar el ID del usuario a dejar de seguir de la lista de suscripciones del usuario actual
        await User.findByIdAndUpdate(subscriberId, { $pull: { reviewsubscriptions: userId } });

        res.status(200).send("Suscripción a las reseñas eliminada correctamente.");
    } catch (error) {
        res.status(500).send("Error al eliminar la suscripción a las reseñas: " + error.message);
    }
});

module.exports = router;