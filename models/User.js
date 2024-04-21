const {mongoose} = require("../DB/connectDB")

let userSchema = mongoose.Schema({
    uid:{
        type: Number
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    userPhoto: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    name:{
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    birthday: {
        type: String,
        format: Date
    },
    country: {
        type: String
    },
    myrecipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        deafult: []
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        deafult: []
    }]
})

userSchema.statics.findUsers= async (filter, isAdmin = false, pageSize=4, pageNumber=1)=>{
    let proj = isAdmin? {}:{name: 1, email:1, _id:0};
    // let docs = await User.find(filter, proj).skip(3).limit(2); filtrar por página,
    let docs = User.find(filter, proj).sort({name: 1}).skip((pageNumber-1)*pageSize).limit(pageSize).populate('myrecipes', 'title').populate('friends', 'username name');
    let count = User.find(filter).count();

    let resp = await Promise.all([docs, count]);

    //console.log("my recipes" + resp[0][0].myrecipes);

    console.log(resp);


    return {users: resp[0], total: resp[1]};
}

userSchema.statics.addrecipes = async (username, recipeId) => {
    let user = await User.findOne({username});
    if(user){
        user.myrecipes.push(recipeId);
        return await user.save();
    }

    return {error: "User not found"};
}

userSchema.statics.addFriends = async (username, friendId) => {
    let user = await User.findOne({username});
    if(user)
    {
        user.friends.push(friendId);
        return await user.save();
    }

    return {error: "user not found"};
}

userSchema.statics.saveUser = async (userData)=>{

    try {
        let newUser = User(userData);
        let doc =  await newUser.save();
        return doc;
    }catch(error)
    {
        return {error_mesg : error.errmsg};
    }
}

userSchema.statics.findUser = async (username)=>{
    let user = await User.findOne({username});
    return user;
}

userSchema.statics.findUserById = async (_id)=>{
    let proj = {username: 1, myrecipes: 1};
    let user = await User.findById({_id},proj).populate('myrecipes', 'title');
    return user;
}

userSchema.statics.updateUser = async (email, userData)=>{
    delete userData.email;
    let updateUser = await User.findOneAndUpdate({email},
                                {$set: userData},
                                {new: true}
                            )
    return updateUser;
}

userSchema.statics.deleteUser = async (email)=>{
    let deletedUser = await User.findOneAndDelete({email})
    console.log(deletedUser);
    return deletedUser;
}

let User = mongoose.model('User', userSchema);

async  function createAndShow(){
    let doc = await User.saveUser({
        "name": 'Gemini',
        "email": 'Gemini@gmail.com',
        "password": 'gemini'
    });
    
}

//createAndShow();

//User.findUsers({},true, 4, 1);


module.exports = {User};