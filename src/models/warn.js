const mongoose = require("mongoose");

const warnSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  guildId: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Warn = mongoose.model("Warn", warnSchema);

module.exports = Warn;
