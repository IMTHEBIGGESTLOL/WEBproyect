const router = require("express").Router()
const { fileURLToPath } = require("url");
const recipes = require('../Data/recipesData.json')
const {Recipe} = require('../models/Recipe.js')
const fs = require('fs');
const {User} = require('../models/User.js');
const auth = require('../middleware/auth.js');
const {Post} = require('../models/Message.js');



router.post('/:recipeId', auth.validateToken ,async (req, res) => {
    console.log(req.body);
    let message = req.body;
    let newMessage = await Post.saveMessage(req.username, req.params.recipeId,message);
    res.send(message);
});

router.delete('/:messageId', auth.validateToken, async (req, res) => {
    const postId = req.body.postId;
    const deletedMessage = await Post.findOneAndDelete({ _id: postId });
    res.send(deletedMessage);

});

module.exports = router;