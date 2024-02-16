const router = require('express').Router();

router.get("/", (req, res) => {

    res.render("login.ejs");
});

router.post("/", (req, res) => {

    const { email, password } = req.body;
    
    if( ! (email === "admin@mail.com" && password === "123") ) 
        return res.redirect("/login");

    req.session.user = { email : email, lastLogin : new Date() };
    res.redirect("/home");
});

module.exports = router;