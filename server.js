
const express = require("express");
const app = express();
const port = 3000;
const userRoute = require('./routes/userRoutes.js');
const recipeRoute = require('./routes/recipeRoutes.js');
const categoryRoute = require('./routes/categoryRoutes.js');
const authRoute = require('./routes/authRoutes.js');
const messageRoute = require('./routes/messagesRoutes.js');
const path = require('path');

function logger(req,res,next)
{
    console.log(req);
    next();
}

//console.log(__dirname);

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.get('/', (req,res)=> {
    res.send("hello")
})

app.use('/api/users', logger, userRoute)

app.use('/api/recipes', logger, recipeRoute)

app.use('/api/categories', logger, categoryRoute)

app.use('/api/login', logger, authRoute);

app.use('/api/messages', logger, messageRoute);

app.listen(port, ()=> console.log("Running in port" + port))

