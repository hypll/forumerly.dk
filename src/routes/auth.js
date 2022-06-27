const router = require("express").Router();
const passport = require("passport");
const User = require("../database/models/User");

router.get("/", (req, res) => {
    res.send(200);
});

// Google Auth

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/?error=true" }),
    function (req, res) {
        res.redirect("/");
    }
);

// Account Management

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
