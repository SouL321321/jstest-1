const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Send a random dog image"),
  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://api.thedogapi.com/v1/images/search"
      );
      const dogImageUrl = response.data[0].url;

      const sentMessage = await interaction.reply({
        content: "Here is a dog🐕:",
        files: [dogImageUrl],
        fetchReply: true
      });

      await sentMessage.react("😍");
      await sentMessage.react("💗");
      await sentMessage.react("🐶");
    } catch (error) {
      console.error("Error while retrieving dog image:", error);
      await interaction.reply(
        "An error occurred while retrieving the dog image."
      );
    }
  },
};
