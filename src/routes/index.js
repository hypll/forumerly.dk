const router = require("express").Router();
const Post = require("../database/models/Post");
const fetch = require("node-fetch");

const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/forum", (req, res) => {
    res.render("forum", {
        user: req.user,
        error: req.flash("error"),
    });
});

router.get("/forum/new", ensureAuth, (req, res) => {
    fetch(process.env.HOST + "/api/categories", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            res.render("new", {
                user: req.user,
                categories: data.categories,
            });
        });
});

router.get("/forum/:category", (req, res) => {
    res.status(200).send({
        message: "Category not found",
        category: req.params.category,
    });
});

router.get("*", (req, res) => {
    req.flash("error", "Vi kunne ikke finde siden du ledte efter.");
    res.redirect("/forum");
});

module.exports = router;
