const mongoose = require("mongoose");

const guildConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  welcomeChannelId: {
    type: String,
    required: true,
  },
  welcomeRoleId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("GuildConfig", guildConfigSchema);
