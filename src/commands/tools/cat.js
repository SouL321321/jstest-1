const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("img-cat")
    .setDescription("Send a random cat image"),

  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      const catImageUrl = response.data[0].url;

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Random Cat Image")
        .setDescription("Here's a cute cat 🐈")
        .setImage(catImageUrl);

      const sentMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });

      await sentMessage.react("😍");
      await sentMessage.react("💗");
      await sentMessage.react("🐱");
    } catch (error) {
      console.error("Error while retrieving cat image:", error);
      await interaction.reply(
        "An error occurred while retrieving the cat image."
      );
    }
  },
};
