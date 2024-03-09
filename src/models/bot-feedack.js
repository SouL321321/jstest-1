const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const botFeedbackSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  guildId: { type: String, required: true },
});

const BotFeedbackModel = model("BotFeedback", botFeedbackSchema);

module.exports = BotFeedbackModel;
