const router = require('express').Router();
const { readFileSync, writeFileSync } = require('fs');

router.get("/", (req, res) => {

    try {
        const data = readFileSync('./public/data/events.json', 'utf-8');
        let events = JSON.parse(data);
        
        if(req.query)
            events = events.filter( e => { 
                const { name, dateini, dateend, active } = req.query; 
                if (name && !e.name.toLowerCase().includes(name.toLowerCase())) return false;
                if (dateini && dateend && !(e.date >= dateini && e.date <= dateend)) return false;
                if (dateini && !e.date >= dateini) return false;
                if (dateend && !e.date <= dateend) return false; console.log(e.active !== active);
                if (typeof active !== 'undefined' && e.active !== (active?.toLowerCase?.() === 'true')) return false;
                return true;
            });
        
        res.send(events);
    }
    catch(e) { res.status(500).send(e.message) }
});

router.post("/", (req, res) => {

    let event = null;

    // VALIDACOES (A FAZER)
    
    const data = readFileSync('./public/data/events.json', 'utf-8');
    let events = JSON.parse(data);

    const { name, date, active } = req.body;
    
    event = { 
        id: Math.max(...events.map(o => o.id)) +1, 
        name, 
        date, 
        active: active !== undefined, 
        user_id: req.session.user.id
    };
    events = [ ...events, event];
    
    let fileContent = JSON.stringify(events, null, 2);
    writeFileSync('./public/data/events.json', fileContent);

    res.send(event);
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