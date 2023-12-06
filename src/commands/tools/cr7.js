const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cr7")
    .setDescription("Get a random image of Cristiano Ronaldo"),

  async execute(interaction) {
    try {
      const apiKey = process.env.CR7_API_KEY;
      if (!apiKey) {
        throw new Error("API Key not provided");
      }

      const response = await axios.get(
        "https://api.unsplash.com/photos/random",
        {
          params: {
            query: "Cristiano Ronaldo",
            orientation: "landscape",
          },
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (!response.data || !response.data.urls || !response.data.urls.full) {
        throw new Error("No Ronaldo images found");
      }

      const imageUrl = response.data.urls.full;

      await interaction.reply({
        content: "🏆🐐",
        embeds: [
          {
            image: {
              url: imageUrl,
            },
          },
        ],
      });
    } catch (error) {
      console.error(`Error executing /cr7 command: ${error.message}`);
      await interaction.reply("An error occurred while executing the command.");
    }
  },
};
