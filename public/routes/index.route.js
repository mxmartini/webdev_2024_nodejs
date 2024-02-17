const router = require('express').Router();

router.get("/", (req, res) => {

    res.render("index");
});

router.get("/add", (req, res) => {

    const id = req.query.id;
    
    req.session.cart.push(id);    
    
    res.redirect("/");
});

module.exports = router;