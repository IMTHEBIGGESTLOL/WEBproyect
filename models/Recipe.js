const {mongoose} = require("../DB/connectDB")
const {User} = require("./User");

let recipeSchema = mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    steps: {
        type: Array,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creation_date: {
        type: String,
        format: Date,
        required: true
    },
    reviews: {
        type: Array,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: []
    }],
    rating: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        required: true
    },
    cook_time: {
        type: Number,
        required: true
    },
    prep_time: {
        type: Number,
        required: true
    }
})

recipeSchema.statics.findRecipes= async (filter, isAdmin = false, pageSize=4, pageNumber=1)=>{
    let proj = isAdmin? {}:{title: 1, description:1, _id:0};
    // let docs = await User.find(filter, proj).skip(3).limit(2); filtrar por página,
    let docs = Recipe.find(filter, proj).sort({name: 1}).skip((pageNumber-1)*pageSize).limit(pageSize).populate('author', 'username').populate('categories', 'name');
    let count = Recipe.find(filter).count();

    let resp = await Promise.all([docs, count]);

    console.log(resp[0], resp[1]);


    return {recipes: resp[0], total: resp[1]};
}

recipeSchema.statics.saveRecipe = async (username, recipeData)=>{

    let autor = await User.findUser(username);
    let id = autor._id;

    recipeData.author = id;

    let newRecipe = Recipe(recipeData);
    let doc = await newRecipe.save();

    await User.addrecipes(username, doc._id);
    return doc;

}

recipeSchema.statics.findRecipe = async (filters, isAdmin = false, _id) => {
    try {
        let proj = isAdmin? {title: 1, author: 1, rating: 1}:{title: 1, author: 1, rating: 1, _id: 0}
        let recipe = await Recipe.findOne({ _id }, proj).populate('author', 'username');
        console.log(recipe);

        if (!recipe) {
            throw new Error('No se encontró la receta');
        }

        // Asegúrate de que la receta tiene una propiedad 'author'
        if (!recipe.author) {
            throw new Error('La receta no tiene autor');
        }

        return recipe;
    } catch (error) {
        console.error('Error al encontrar la receta:', error);
        // Manejar el error adecuadamente
    }
}

recipeSchema.statics.updateRecipe = async (_id, recipeData)=>{
    delete recipeData.rating;
    delete recipeData.author;
    let updateRecipe = await Recipe.findOneAndUpdate({_id},
                                {$set: recipeData},
                                {new: true}
                            )
    return updateRecipe;
}

recipeSchema.statics.deleteRecipe = async (_id)=>{
    let deletedRecipe = await Recipe.findOneAndDelete({_id})
    console.log(deletedRecipe);
    return deletedRecipe;
}

let Recipe = mongoose.model('Recipe', recipeSchema);

async  function createAndShow(){
    let doc = await Recipe.saveRecipe({
        "instructions": [],
        "title": 'Mole Negro',
        "description": 'Puerco en salsa de chile pasilla',
        "ingredients": [ 'lomo', 'chile pasilla' ],
        "steps": [ 'cocinar', 'comer' ],
        "author": '6620682a8c79b23fa54bd305',
        "creation_date": 'Wed Apr 17 2024 00:00:00 GMT-0600 (Central Standard Time)',
        "reviews": [ 'muy rica y deliciosa' ],
        "categories": [ 'mexican' ],
        "rating": 5,
        "uid": '2',
        "photo": 'https://www.hazteveg.com/img/recipes/full/202002/R06-92840.jpg',
        "cook_time": 30,
        "prep_time": 45
    });
    
}

//createAndShow();

Recipe.findRecipes({},true, 4, 1);


module.exports = {Recipe};