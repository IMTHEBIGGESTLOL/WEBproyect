const router = require("express").Router()
const { fileURLToPath } = require("url");
const recipes = require('../Data/recipesData.json')
const {Recipe} = require('../models/Recipe.js')
const fs = require('fs');
const auth = require('../middleware/auth.js');

// Operación GET para obtener todas las recetas
router.get('/', auth.validateHeader ,auth.validateAdmin,async (req, res)=> {
    let filters = {}
    let recipes = await Recipe.findRecipes(filters, req.admin, 5,1);
    res.json(recipes);
});

// Operación POST para crear una nueva receta
router.post('/', async (req, res) => {
    const fechaDeHoy = new Date();
    const fechaLegible = fechaDeHoy.toDateString();
    req.body.creation_date = fechaLegible;

    console.log(req.body);
    let recipe = req.body;
    let newRecipe = await Recipe.saveRecipe(recipe);
    res.send(newRecipe);
});

// Operación GET para obtener una receta por su ID
router.get('/:recipeId', async (req, res) => {
    let filters = {}
    let recipe = await Recipe.findRecipe({filters}, req.params.recipeId)
    if(!recipe){
        res.status(404).send({error: "Recipe Not Found"})
        return;
    }    

    res.send(recipe)
});

// Operación DELETE para eliminar una receta por su ID
router.delete('/:recipeId', async (req, res) => {
    const recipeId = req.params.recipeId;
    let recipe = await Recipe.findRecipe({}, req.params.recipeId)
    if(!recipe){
        res.status(404).send({error: "Recipe Not Found"})
        return;
    } 
    let recipedeleted = await Recipe.deleteRecipe(recipeId);
    res.send(recipedeleted);
});

// Operación PUT para actualizar una receta por su ID
router.put('/:recipeId', async (req, res) => {
    let recipe = await Recipe.findRecipe({},req.params.recipeId);

    //if not found 
    if (!recipe){
        // return 404 not found 
        res.status(404).send({error: 'Recipe not found'})
        return
    }

    let updateRecipe = await Recipe.updateRecipe(recipe._id, req.body);
    //fs.writeFileSync('./data/usersdata.json', JSON.stringify(users) )
    res.send(updateRecipe)
});

module.exports = router;
