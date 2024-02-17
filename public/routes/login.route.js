const router = require('express').Router();
const { readFileSync } = require('fs');

router.get("/", (req, res) => {

    res.render("login.ejs");
});

router.post("/", (req, res) => {

    const { email, password } = req.body;
    
    const data = readFileSync('./public/data/users.json', 'utf-8');
    const users = JSON.parse(data);
    const user = users.find((u) => u.email === email && u.password === password);

    if(!user) 
        return res.redirect("/login");

    res.locals.user = req.session.user = { ...user, lastLogin : new Date() };
    res.redirect("/home");
});

module.exports = router;