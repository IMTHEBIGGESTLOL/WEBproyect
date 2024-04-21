const router = require("express").Router()
const { fileURLToPath } = require("url");
const recipes = require('../Data/recipesData.json')
const {Recipe} = require('../models/Recipe.js')
const fs = require('fs');
const {User} = require('../models/User.js');
const auth = require('../middleware/auth.js');

// Operación GET para obtener todas las recetas
router.get('/', auth.validateHeader ,auth.validateAdmin,async (req, res)=> {
    let filters = {}
    console.log(req.admin)
    let recipes = await Recipe.findRecipes(filters, req.admin, 5,1);
    res.json(recipes);
});

// Operación POST para crear una nueva receta
router.post('/', auth.validateUser,async (req, res) => {
    const fechaDeHoy = new Date();
    const fechaLegible = fechaDeHoy.toDateString();
    req.body.creation_date = fechaLegible;
    console.log(req.body);
    let recipe = req.body;
    let newRecipe = await Recipe.saveRecipe(req.token, recipe);
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
router.put('/:recipeId',auth.validateUser, async (req, res) => {
    let recipe = await Recipe.findRecipe({},req.params.recipeId);
    let user = await User.findUser(req.token);

    console.log(recipe.author._id.toString());
    if (!recipe){
        // return 404 not found 
        res.status(404).send({error: 'Recipe not found'})
        return
    }

    if(user == null || user._id != recipe.author._id.toString()){
        res.status(403).send({error: 'You are not the owner'})
        return
    }

    let updateRecipe = await Recipe.updateRecipe(recipe._id, req.body);
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send(updateRecipe)
});

module.exports = router;
