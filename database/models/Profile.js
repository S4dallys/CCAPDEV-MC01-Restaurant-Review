const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        // TODO: Use actual image!!
        type: String,
        default: "default_avatar.png"
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
        default: () => { Date.now() },
        immutable: true
     }
})

module.exports = mongoose.model("Profile", profileSchema);
