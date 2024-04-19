const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("img-moon")
    .setDescription("Get the image of the moon. 🌓"),

    async execute (interaction) {
    try {
      const unsplashApiKey = process.env.UNSPLASH_API;
      const response = await axios.get(
        "https://api.unsplash.com/photos/random",
        {
          params: {
            query: "moon",
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${unsplashApiKey}`,
          },
        }
      );

      const imageUrl = response.data.urls.full;

      await interaction.reply({
        content: ".🌝.",
        embeds: [
          {
            image: {
              url: imageUrl,
            },
          },
        ],
      });
    } catch (error) {
      console.error(`Error executing /planet command: ${error.message}`);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
