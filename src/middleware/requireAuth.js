module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect(
                "/login?returnURL=" +
                    req.originalUrl +
                    "&message=You must be logged in to access the page"
            );
        }
    },

    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            return next();
        }
    },
};
