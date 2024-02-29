const { readFileSync } = require('fs');
const bcrypt = require('bcrypt');

const usersController = {

    findAll(){

        const data = readFileSync('./public/data/users.json', 'utf-8');
        const users = JSON.parse(data);
        return users;
    },

    findOne(id){
     
        const data = readFileSync('./public/data/users.json', 'utf-8');
        const users = JSON.parse(data);
        const user = users.find((u) => u.id === id);
        return user;
    },

    findByEmailAndPassword(email, password){
     
        const data = readFileSync('./public/data/users.json', 'utf-8');
        const users = JSON.parse(data);
        const user = users.find((u) => u.email === email && bcrypt.compare(password, u.password));
        return user;
    }
}

module.exports = usersController;
