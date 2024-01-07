const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sky")
    .setDescription("Get a sky image"),

    async execute (interaction) {
    try {
      const unsplashApiKey = process.env.UNSPLASH_API_KEY;
      const response = await axios.get(
        "https://api.unsplash.com/photos/random",
        {
          params: {
            query: "sky",
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${unsplashApiKey}`,
          },
        }
      );

      const imageUrl = response.data.urls.full;

      await interaction.reply({
        content: ".🔭.",
        embeds: [
          {
            image: {
              url: imageUrl,
            },
          },
        ],
      });
    } catch (error) {
      console.error(`Error executing /sky command: ${error.message}`);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
