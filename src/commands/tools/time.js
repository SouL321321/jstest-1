const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Return the time!⌚"),
  async execute(interaction, client) {
    const actualTime = new Date().toLocaleTimeString();
    interaction.reply(`Time: ${actualTime}`);
  },
};
