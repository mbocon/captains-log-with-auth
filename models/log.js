const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    title: String,
    entry: String,
    shipIsBroken: Boolean,
    user: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;