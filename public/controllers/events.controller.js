const { readFileSync } = require('fs');
const z = require('../modules/z-param')

const mysql = require('mysql2-promise')();
const config = require('../config/db.config');
const { required } = require('nodemon/lib/config');
mysql.configure(config);

mysql.pool.on('connection', function (poolConnection) {
  poolConnection.config.namedPlaceholders = true;
});

const eventsController = {

    async findAll(){

        try {
            const [results, fields] = await mysql.query(
                'SELECT * FROM webdev.event'
            );
            return results;
        }
        catch(e) {
            throw e
        }
    },

    async findWhere(query){

        try {

            z.object({ 
                name: "string?",
                dateini: "date?",
                dateend: "date?",
                active: "boolean?"
            });

            let filter = z.parse(query, { BOOLEAN_AS: "number" });
            
            let where = Object.keys(filter).map(key => {
                switch(key) {
                    case "name": return `name like :${key}`;
                    case "dateini": return `date >= :${key}`;
                    case "dateend": return `date <= :${key}`;
                    case "active": return `active = :${key}`;
                }
            }).join(" and ");
            
            if(where) where = ` where ${where}`;
            if(filter.name) filter.name = `%${filter.name}%`;    
            
            const [results, fields] = await mysql.query(
                'SELECT * FROM webdev.event' + where, filter
            );
            return results;
        }
        catch(e) {
            throw e
        }
    },

    async findOne(id){
     
        try {
            const [results, fields] = await mysql.query(
                `SELECT * FROM webdev.event WHERE id = ?`, id
            );
            return results;
        }
        catch(e) {
            throw e
        }
        return user;
    },

    async create (body) {
  
        try {
          
            if (!body.name || !body.date) throw new Error("Please inform the required fields.")
          
            z.object({ 
                name: "string",
                date: "date",
                active: "boolean"
            });
            const item = z.parse(body, { BOOLEAN_AS : "number" });
            
            const [{ affectedRows, insertId }]  = await mysql.execute(
                'INSERT INTO webdev.event (name,date, active) VALUES (:name, :date, :active)', 
                item
            );
            const data = z.parse(item, { BOOLEAN_AS : "boolean"});
            
            return { id : insertId, ...data, updatedAt: null };
        } 
        catch (e) {  
            throw e; 
        }
    }
}

module.exports = eventsController;