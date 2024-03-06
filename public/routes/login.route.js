const router = require('express').Router();
const { readFileSync } = require('fs');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const passport = require('passport');

router.get("/", (req, res) => {
    
    res.render("login.ejs");
});

router.post("/", passport.authenticate('local', { 
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
 }));

router.post("/old", (req, res) => {

    const { email, password } = req.body;
    
    const data = readFileSync('./public/data/users.json', 'utf-8');
    const users = JSON.parse(data);
    //const user = users.find((u) => u.email === email && bcrypt.compare(password, u.password));
    const salt = process.env.PASSWORD_SALT;
    const cpassword = crypto.createHash('sha256').update(password+salt).digest("hex");
    const user = users.find((u) => u.email === email && u.password === cpassword);

    if(!user) 
        return res.redirect("/login");

    res.locals.user = req.session.user = { ...user, lastLogin : new Date() };
    res.redirect("/home");
});

module.exports = router;