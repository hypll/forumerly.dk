require("dotenv").config();
const router = require("express").Router();
const User = require("../database/models/User");
const Post = require("../database/models/Post");
const Comment = require("../database/models/Comment");
const fetch = require("node-fetch");
const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.post("/", (req, res) => {
    const { title, description, body, category, tags } = req.body;

    const post = new Post({
        title,
        description,
        body,
        category,
        tags,
        user: req.user.id,
    });

    post.save()
        .then((post) => {
            res.redirect(`/forum/d/${post.id}`);
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error creating post",
                error,
            });
        });
});

router.put("/", ensureAuth, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        {
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            tags: req.body.tags,
        },
        { new: true }
    )
        .then((post) => {
            req.flash("success", "Dit post blev opdateret!");
            res.redirect(`/forum/d/${post.id}/edit`);
        })
        .catch((error) => {
            req.flash("error", "Der skete en fejl, prøv igen!");
            res.redirect(`/forum/d/${req.body.postId}/edit`);
        });
});

router.post("/comment", ensureAuth, (req, res) => {
    const { comment, postId } = req.body;

    const newComment = new Comment({
        content: comment,
        author: [req.user.id, req.user.name, req.user.avatar],
        post: postId,
    });

    newComment
        .save()
        .then((comment) => {
            req.flash("success", "Kommentaren blev tilføjet!");
            res.redirect(`/forum/d/${postId}`);
        })
        .catch((error) => {
            res.status(500).redirect(`/forum/d/${postId}`);
        });
});

router.delete("/delete/post", ensureAuth, (req, res) => {
    Post.findByIdAndDelete(req.body.postId)
        .then((post) => {
            req.flash("success", "Dit post blev slettet!");
            res.redirect(`/forum/u/${req.user.id}/edit`);
        })
        .catch((error) => {
            req.flash("error", "Der skete en fejl, prøv igen!");
            res.redirect(`/forum/d/${req.body.postId}`);
        });
});

router.delete("/comment/:id", ensureAuth, (req, res) => {
    Comment.findById(req.params.id)
        .then((comment) => {
            if (comment.author[0] === req.user.id) {
                Comment.findByIdAndDelete(req.params.id)
                    .then((comment) => {
                        req.flash("success", "Kommentaren blev slettet!");
                        res.redirect(`/forum/d/${comment.post}`);
                    })
                    .catch((error) => {
                        res.status(500).send({
                            message: "Error deleting comment",
                            error,
                        });
                    });
            } else {
                res.status(401).send({
                    message: "You are not authorized to delete this comment",
                });
            }
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error finding comment",
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

router.post("/@me", ensureAuth, async (req, res) => {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);

    user.name = name;
    user.bio = bio;
    user.avatar = avatar;

    user.save()
        .then((user) => {
            req.flash("success", "Dine oplysninger blev opdateret!");
            res.redirect(`/forum/u/${user.id}/edit`);
        })
        .catch((error) => {
            req.flash("error", "Du skal udfylde alle felter!");
            res.redirect(`/forum/u/${user.id}/edit`);
        });
});

router.post("/@me/darkmode", async (req, res) => {
    const { darkmode } = req.body;

    const user = await User.findById(req.user.id);

    user.darkmode = darkmode;

    user.save()
        .then((user) => {
            req.flash("success", "Dit theme blev ændret!");
            res.redirect(`/forum/settings`);
        })
        .catch((error) => {
            req.flash("error", "Du skal udfylde alle felter!");
            res.redirect(`/forum/settings`);
        });
});

router.delete("/@me/delete", (req, res) => {
    User.findOneAndDelete({ _id: req.user._id }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
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
