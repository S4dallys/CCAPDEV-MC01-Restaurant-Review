const mongoose = require("mongoose");

const ownersResponseSchema = new mongoose.Schema({
    lastUpdated: {
        type: Date,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

const reviewSchema = new mongoose.Schema({
    restoId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Resto",
        required: true
    },
    profileId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Profile",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    dislikes: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: []
    },
    stars: {
        type: Number,
        required: true
    },
    ownersResponse: {
        type: ownersResponseSchema,
        default: null
    },
    hasOr: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Review", reviewSchema);
