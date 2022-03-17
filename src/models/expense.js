const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExpenseSchema = new Schema({
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    kind: { type: String, required: true },
})

module.exports = mongoose.model("Exp", ExpenseSchema)