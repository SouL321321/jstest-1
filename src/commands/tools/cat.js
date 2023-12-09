const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Send a random cat image"),

  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      const catImageUrl = response.data[0].url;

      const message = await interaction.reply({
        content: "Here is a cat 🐈:",
        files: [{ attachment: catImageUrl, name: "cat.jpg" }],
        fetchReply: true,
      });

      await message.react("😍");
      await message.react("💗");
      await message.react("🐱");
    } catch (error) {
      console.error("Error while retrieving cat image:", error);
      await interaction.reply(
        "An error occurred while retrieving the cat image."
      );
    }
  },
};
