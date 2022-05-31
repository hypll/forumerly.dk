require("dotenv").config();
const router = require("express").Router();
const User = require("../database/models/User");
const Post = require("../database/models/Post");
const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.post("/", (req, res) => {
    const { title, body, category, tags } = req.body;

    const post = new Post({
        title,
        body,
        category,
        tags,
        user: req.user.id,
    });

    post.save()
        .then((post) => {
            res.status(200).send({
                message: "Post created successfully",
                post,
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error creating post",
                error,
            });
        });
});

router.get("/categories", (req, res) => {
    let categories = [
        {
            id: 1,
            name: "Generelle Ting",
            description: "Del historier, idéer og mere!",
            url: "generelle-ting",
        },

        {
            id: 2,
            name: "Udvikling",
            description: "Udvikling af spil, kode og andet.",
            url: "udvikling",
        },
    ];

    res.status(200).send({
        categories,
    });
});

router.get("/@me", ensureAuth, async (req, res) => {
    User.findById(req.user.id)
        .then((user) => {
            res.status(200).send({
                message: "User found",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error finding user",
                error,
            });
        });
});

router.get("/@me/posts", ensureAuth, async (req, res) => {
    Post.find({ user: req.user.id })
        .then((posts) => {
            res.status(200).send({
                message: "Posts retrieved successfully",
                posts,
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error retrieving posts",
                error,
            });
        });
});

module.exports = router;
