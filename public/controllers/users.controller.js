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
        const user = users.find(u => u.id === id);
        return user;
    },

    async findByEmailAndPassword(email, password){
     
        const data = readFileSync('./public/data/users.json', 'utf-8');
        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);
        
        if (!user)
            throw Error("No user found by email");
        
        const isPasswordRight = await bcrypt.compare(password, user.password);
        
        if(!isPasswordRight) 
            throw Error("Password is incorrect");
        
        return user;
    }
}

module.exports = usersController;