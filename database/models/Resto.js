const mongoose = require("mongoose");

const restoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        default: "default_poster.png"
    },
    description: {
        type: String,
        default: "No description."
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }
})

module.exports = mongoose.model("Resto", restoSchema);
