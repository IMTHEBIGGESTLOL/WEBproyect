const router = require("express").Router()
const { fileURLToPath } = require("url");
const recipes = require('../Data/recipesData.json')
const {Recipe} = require('../models/Recipe.js')
const fs = require('fs');
const {User} = require('../models/User.js');
const auth = require('../middleware/auth.js');
const {Post} = require('../models/Message.js');

// Operación GET para obtener todas las recetas
router.get('/', auth.validateHeader ,auth.validateAdmin, auth.addSkipLimittoGet() ,async (req, res)=> {
    let filters = {}
    console.log(req.admin)
    let recipes = await Recipe.findRecipes(filters, req.admin, 5,1, req.skip, req.limit);
    res.json(recipes);
});

router.get('/mine', auth.validateToken, async (req,res)=>{
    console.log("owner", req.username, req._id);
    const myrecipes =  await Recipe.getRecipes(req._id)
    
    res.send(myrecipes)
});

router.get('/favorites', auth.validateToken, async (req,res)=>{
    let recipes = await User.getFavorites(req._id);
    res.send(recipes);
});

router.post('/favorites/:recipeId', auth.validateToken, async (req,res)=>{
    let status = await User.addFavorites(req.username, req.params.recipeId);
    res.send(status);
});

router.delete('/favorites/:recipeId', auth.validateToken, async (req,res)=>{
    let status = await User.removeFavorites(req.username, req.params.recipeId);
    res.send(status);
});

router.get('/chat/:recipeId', async (req, res)=>{
    let chat = await Recipe.getChat(req.params.recipeId);
    res.send(chat);
})

// Operación POST para crear una nueva receta
router.post('/', auth.validateToken,async (req, res) => {
    console.log(User)
    console.log(req.body);
    let recipe = req.body;
    let newRecipe = await Recipe.saveRecipe(req.username, req._id, recipe);
    res.send(recipe);
});

// Operación GET para obtener una receta por su ID
router.get('/:recipeId', auth.validateHeader ,auth.validateAdmin, async (req, res) => {
    let filters = {}
    let recipe = await Recipe.findRecipe({filters},req.admin, req.params.recipeId)
    if(!recipe){
        res.status(404).send({error: "Recipe Not Found"})
        return;
    }    

    res.send(recipe)
});

// Operación DELETE para eliminar una receta por su ID
router.delete('/:recipeId',auth.validateHeader, auth.validateAdmin,auth.validateUser ,async (req, res) => {
    const recipeId = req.params.recipeId;
    let recipe = await Recipe.findRecipe({}, req.params.recipeId)
    if(!recipe){
        res.status(404).send({error: "Recipe Not Found"})
        return;
    } 

    if(recipe.author.username != req.token && !req.admin){
        res.status(403).send({error: "You dont have permissions"})
        return
    }

    let recipedeleted = await Recipe.deleteRecipe(recipeId);
    res.send(recipedeleted);
});

// Operación PUT para actualizar una receta por su ID
router.put('/:recipeId', auth.validateToken, async (req, res) => {
    let recipe = await Recipe.findRecipe({},req.params.recipeId);

    console.log(recipe.author._id.toString());
    if (!recipe){
        // return 404 not found 
        res.status(404).send({error: 'Recipe not found'})
        return
    }

    if(req._id != recipe.author._id.toString()){
        res.status(403).send({error: 'You are not the owner'})
        return
    }

    let updateRecipe = await Recipe.updateRecipe(recipe._id, req.body);
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send(updateRecipe)
});

// Endpoint para añadir un mensaje al chat de una receta específica
router.post('/:recipeId/chat',auth.validateToken,async (req, res) => {
    try {
        const user = req.username
        const { content } = req.body;
        const recipeId = req.params.recipeId;

        console.log(user)

        //Verificar si la receta existe
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }

        // Crear el mensaje
        const message = new Post({ user, content });

        // Guardar el mensaje en la base de datos
        await message.save();

        // Añadir el ID del mensaje al chat de la receta
        recipe.chat.push(message._id);
        await recipe.save();

        res.status(201).json({ message: 'Mensaje añadido al chat de la receta correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al añadir mensaje al chat de la receta', error: error.message });
    }
});

module.exports = router;
