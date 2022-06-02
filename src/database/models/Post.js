const mongoose = require("mongoose");
const marked = require("marked");

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "Titel er påkrævet"] },
        body: {
            type: String,
            required: [true, "En beskrivelse af dit indlæg er påkrævet"],
        },
        category: { type: String, required: [true, "Kategori er påkrævet"] },
        views: { type: Number, default: 0 },
        tags: {
            type: [String],
            required: [true, "Der kræves mindst ét tag"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Der kræves en bruger til indlæg"],
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
