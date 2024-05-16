const mongoose = require("mongoose");

const welcomeEvSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const WelcomeEv = mongoose.model("WelcomeEv", welcomeEvSchema);

module.exports = WelcomeEv;
