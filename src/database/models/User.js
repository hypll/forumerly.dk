const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        bio: {
            type: String,
            minlength: [5, "Bio skal være mindst 5 tegn"],
            maxlength: [50, "Bio må ikke være mere end 50 tegn"],
        },

        darkmode: {
            type: String,
            default: "false",
        },

        avatar: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
