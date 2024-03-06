const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
        // TODO: Use actual image!!
        type: String,
        default: () => { null }
    },
    description: {
        type: String,
        default: "Say something about yourself!"
    },
    totalErms: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: () => { Date.now() }
    }
})

module.exports = mongoose.model("Profile", profileSchema);
