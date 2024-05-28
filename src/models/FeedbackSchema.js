const { Schema, model } = require("mongoose");

const feedbackschema = new Schema({
  Guild: String,
  FeedbackChannel: String,
});

module.exports = model("feedbackSchema", feedbackschema);
