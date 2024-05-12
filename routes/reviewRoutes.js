const router = require("express").Router()
const { fileURLToPath } = require("url");
const recipes = require('../Data/recipesData.json')
const fs = require('fs');
const auth = require('../middleware/auth.js');
const {Review} = require('../models/Review.js');
const { Recipe } = require("../models/Recipe.js");

router.get('/', auth.validateTokenWithCookie ,async (req, res)=> {
    let filters = {}
    console.log(req.admin)
    let reviews = await Review.findReviews(filters, req.admin, 5,1);
    res.json(recipes);
});

router.post('/:recipeId', auth.validateTokenWithCookie ,async (req, res) => {
    console.log(req.body);
    let review = req.body;
    let newReview = await Review.saveReview(req._id, review, req.params.recipeId);
    res.send(newReview);
});

router.put('/:recipeId/:reviewId', auth.validateTokenWithCookie ,async (req, res) => {
    
    let review = await Review.findById(req.params.reviewId);

    if(!review){
        res.status(404).send({error: "Review Not Found"})
        return;
    } 

    if(review.author._id != req._id){
        res.status(403).send({error: "You dont have permissions"})
        return
    }

    console.log(req.body);
    let UpdateReview = await Review.updateReview(review._id, req.body, req.params.recipeId);
    res.send(UpdateReview);
});


router.delete('/:recipeId/:reviewId', auth.validateTokenWithCookie, async (req, res)=>{
    const reviewid = req.params.reviewId;
    let review = await Review.findById(reviewid);
    if(!review){
        res.status(404).send({error: "Review Not Found"})
        return;
    } 

    if(review.author._id != req._id){
        res.status(403).send({error: "You dont have permissions"})
        return
    }

    let reviewdeleted = await Review.deleteReview(req.username, reviewid, req.params.recipeId);
    res.send(reviewdeleted);
});

module.exports = router