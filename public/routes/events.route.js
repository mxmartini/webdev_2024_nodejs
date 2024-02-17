const router = require('express').Router();
const { readFileSync, writeFileSync } = require('fs');
const { randomUUID } = require('crypto');

router.get("/", (req, res) => {

    const data = readFileSync('./public/data/events.json', 'utf-8');
    const json = JSON.parse(data);

    res.send(json);
});

router.post("/", (req, res) => {

    let object = null;

    // VALIDACOES (A FAZER)
    
    const data = readFileSync('./public/data/events.json', 'utf-8');
    let json = JSON.parse(data);

    const { name, date, active } = req.body;
    
    object = { 
        id: Math.max(...json.map(o => o.id)) +1, 
        name, 
        date, 
        active: active !== undefined, 
        user_id: req.session.user.id
    };
    json = [ ...json, object];
    
    let fileContent = JSON.stringify(json, null, 2);
    writeFileSync('./public/data/events.json', fileContent);

    res.send(object);
});

module.exports = router;