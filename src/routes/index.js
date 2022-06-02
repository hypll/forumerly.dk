const router = require("express").Router();
const Post = require("../database/models/Post");
const Comment = require("../database/models/Comment");
const User = require("../database/models/User");
const fetch = require("node-fetch");
const { tags } = require("../../config.json");
const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/forum", async (req, res) => {
    res.render("forum", {
        user: req.user,
        error: req.flash("error"),
        posts: await Post.find({}).sort({ createdAt: -1 }),
    });
});

router.get("/forum/d/:id", async (req, res) => {
    Post.findById({ _id: req.params.id }, async (err, discussion) => {
        if (discussion === null || !discussion) {
            res.redirect("/");
        } else {
            res.render("discussion", {
                user: req.user,
                comments: await Comment.find({ post: discussion.id }).sort({
                    createdAt: -1,
                }),
                post: discussion,
                success: req.flash("success"),
            });
        }
    });
});

router.get("/forum/u/:id", async (req, res) => {
    User.findById({ _id: req.params.id }, async (err, user) => {
        if (user === null || !user) {
            res.redirect("/");
        } else {
            res.render("user", {
                user: req.user,
                userp: user,
                posts: await Post.find({ user: user.id }).sort({
                    createdAt: -1,
                }),

                success: req.flash("success"),
            });
        }
    });
});

router.get("/forum/u/:id/edit", ensureAuth, async (req, res) => {
    User.findById({ _id: req.params.id }, async (err, user) => {
        if (user === null || !user) {
            res.redirect("/");
        } else if (req.user.id != user.id) {
            res.redirect("/");
        } else {
            res.render("edit", {
                user: req.user,
                userp: user,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        }
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
                tags,
            });
        });
});

router.get("/forum/:category", (req, res) => {
    res.status(200).send({
        message: "Category not found",
        category: req.params.category,
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("*", (req, res) => {
    req.flash("error", "Vi kunne ikke finde siden du ledte efter.");
    res.redirect("/forum");
});

module.exports = router;
