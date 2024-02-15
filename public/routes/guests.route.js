const router = require('express').Router();
const { readFile, writeFile } = require('fs');

router.get("/", (req, res) => {

    readFile('./public/guests.json', 'utf-8', (err, json) => res.send(json));
});

router.post("/", (req, res) => {

    let newGuest = null;

    // VALIDACOES (A FAZER)
    
    readFile('./public/guests.json', 'utf-8', (err, data) => {

        let json = JSON.parse(data);
        
        newGuest = { "name" : req.body.name, "age" : req.body.age };
        json = [ ...json, newGuest ];

        let fileContent = JSON.stringify(json, null, 2);
        writeFile('./public/guests.json', fileContent, (err) => {
            
            return res.send(newGuest)
        });
        
    });

});

module.exports = router;