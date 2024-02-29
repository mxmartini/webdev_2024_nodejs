const router = require('express').Router();

router.get("/", (req, res) => {

    req.logOut(() => {

        req.session.destroy();
        res.redirect("/");
    });
});

module.exports = router;