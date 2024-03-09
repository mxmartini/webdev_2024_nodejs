const router = require('express').Router();
const { readFileSync, writeFileSync } = require('fs');
const eventsController = require('../controllers/events.controller');

router.get("/", async (req, res) => {

    try {
        
        let events = await eventsController.findWhere(req.query);
        
        res.send(events);
    }
    catch(e) { res.status(500).send(e.message) }
});

router.post("/", async (req, res) => {

    try {   
            
        let event = await eventsController.create(req.body);

        res.send(event);
    }
    catch(e) { res.status(500).send(e.message) }
});

router.put("/:encid", (req, res) => {

    let event = null;

    const data = readFileSync('./public/data/events.json', 'utf-8');
    let events = JSON.parse(data);

    const id = Buffer.from(req.params.encid, 'base64').toString('ascii');
    
    const i = events.findIndex((e) => e.id == id);
    const oldEvent = events[i];
    
    const { name, date, active } = req.body;
    
    event = { 
        id: Number(id),
        name, 
        date, 
        active: active !== undefined, 
        user_id: oldEvent.user_id
    };

    events[i] = event;

    let fileContent = JSON.stringify(events, null, 2);
    writeFileSync('./public/data/events.json', fileContent);

    res.send(event);
});

router.delete("/:encid", (req, res) => {

    let event = null;

    const data = readFileSync('./public/data/events.json', 'utf-8');
    let events = JSON.parse(data);

    const id = Buffer.from(req.params.encid, 'base64').toString('ascii');
    
    event = events.find((e) => e.id == id);
    
    events.forEach((e, i) => {
        if(e.id == event.id) events.splice(i, 1);
    });

    let fileContent = JSON.stringify(events, null, 2);
    writeFileSync('./public/data/events.json', fileContent);

    res.send(event);
});

module.exports = router;