const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const feedbackSchema = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const FeedbackModel = model("Feedback", feedbackSchema);

module.exports = FeedbackModel;
