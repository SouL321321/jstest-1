const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("goat-sheep-bighom")
    .setDescription("Get a random goat, sheep, or bighorn image."),

  async execute(interaction) {
    try {
      const unsplashApiKey = process.env.UNSPLASH_API;
      const response = await axios.get(
        "https://api.unsplash.com/photos/random",
        {
          params: {
            query: "goat",
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${unsplashApiKey}`,
          },
        }
      );

      const imageUrl = response.data.urls.full;

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Random Goat, Sheep, or Bighorn Image")
        .setDescription("Here's the 🐐 🐑 🐏")
        .setImage(imageUrl);

      const sentMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });
      await sentMessage.react("🐐");
      await sentMessage.react("🐑");
      await sentMessage.react("🐏");
    } catch (error) {
      console.error(`Error executing /goat command: ${error.message}`);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
