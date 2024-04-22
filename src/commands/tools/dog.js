const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("img-dog")
    .setDescription("Send a random dog image"),

  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://dog.ceo/api/breeds/image/random"
      );
      const dogImageUrl = response.data.message;

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Random Dog Image")
        .setDescription("Here's a cute dog 🐕")
        .setImage(dogImageUrl);

      const sentMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
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
