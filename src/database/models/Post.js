const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Title is required"] },
    body: { type: String, required: [true, "Body is required"] },
    category: { type: String, required: [true, "Category is required"] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A user for posts are required"],
    },
});

module.exports = mongoose.model("Post", PostSchema);
