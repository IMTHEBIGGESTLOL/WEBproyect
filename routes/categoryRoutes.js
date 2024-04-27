const router = require("express").Router()
const { fileURLToPath } = require("url");
const recipes = require('../Data/recipesData.json')
const {Recipe} = require('../models/Recipe.js')
const fs = require('fs');
const auth = require('../middleware/auth.js');
const { Category } = require("../models/Category.js");

// Operación GET para obtener todas las categorias
router.get('/', auth.validateHeader ,auth.validateAdmin,async (req, res)=> {
    let filters = {}
    let categories = await Category.findCategories(filters, req.admin);
    res.json(categories);
});

module.exports = router;