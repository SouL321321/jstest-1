const mongoose = require("mongoose");

const kickBanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["kick", "ban"],
    required: true,
  },
  reason: {
    type: String,
    default: "No reason provided",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const KickBan = mongoose.model("KickBan", kickBanSchema);

module.exports = KickBan;
