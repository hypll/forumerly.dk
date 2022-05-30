const router = require("express").Router();
const Post = require("../database/models/Post");

const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", (req, res) => {
    res.redirect("/forum");
});

router.get("/forum", (req, res) => {
    res.render("index", {
        user: req.user,
        error: req.flash("error"),
    });
});

router.get("*", (req, res) => {
    req.flash("error", "Vi kunne ikke finde siden du ledte efter.");
    res.redirect("/forum");
});

module.exports = router;
