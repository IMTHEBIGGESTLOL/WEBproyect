
const fs = require('fs');

let users = require('../Data/usersData.json');
const { use } = require('../routes/userRoutes');

users.push({name: "TestAdd", email: "Test@mail.com", uid: 0});

//esperar a que se guarde el archivo
fs.writeFileSync('./Data/usersData.json', JSON.stringify(users));