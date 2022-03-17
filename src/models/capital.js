const mongoose = require("mongoose");
const { Schema } = mongoose;

const CapitalSchema = new Schema({
    money: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Cap", CapitalSchema)