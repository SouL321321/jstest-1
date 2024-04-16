const mongoose = require("mongoose");

const timeoutMemberSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  memberId: { type: String, required: true },
  timeoutEnd: { type: Date, required: true },
});

module.exports = mongoose.model("TimeoutMember", timeoutMemberSchema);
