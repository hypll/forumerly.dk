const mongoose = require("mongoose");
const marked = require("marked");

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "Title is required"] },
        body: { type: String, required: [true, "Body is required"] },
        category: { type: String, required: [true, "Category is required"] },
        views: { type: Number, default: 0 },
        tags: {
            type: [String],
            required: [true, "At least one tag is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A user for posts are required"],
        },
        sanitizedHtml: {
            type: String,
            // required: [true, "Sanitized HTML is required"],
        },
    },
    { timestamps: true }
);

// PostSchema.pre("save", function (next) {
//     this.sanitizedHtml = marked(this.body);
//     next();
// });

module.exports = mongoose.model("Post", PostSchema);
