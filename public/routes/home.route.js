const router = require('express').Router();

router.get("/", (req, res) => {

    if(!req.session.user)
        return res.redirect("/login");

    res.render("home.ejs");
});

module.exports = router;