const router = require('express').Router();

router.get("/", (req, res) => {

    const groupedCart = req.session.cart.reduce((agg, item) => {
        agg[item] += 50;
        return agg;
    }, { "QR": 0, "RSVP": 0, "STD": 0 });
    
    res.render("index", { cart : groupedCart });
});

router.get("/add", (req, res) => {

    const id = req.query.id;
    
    req.session.cart.push(id);    
    
    res.redirect("/");
});

module.exports = router;