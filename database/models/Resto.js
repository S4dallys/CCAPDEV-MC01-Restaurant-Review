const mongoose = require("mongoose");

const restoSchema = new mongoose.Schema({
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
        default: "No description."
    },
})

module.exports = mongoose.model("Resto", restoSchema);
