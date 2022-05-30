const router = require("express").Router();
const Post = require("../database/models/Post");

const { ensureAuth, ensureGuest } = require("../middleware/requireAuth");

router.get("/", ensureGuest, async (req, res) => {
    res.render("index", {
        user: req.user,
        posts: Post.find({ user: req.user.id }),
    });
});

module.exports = router;
