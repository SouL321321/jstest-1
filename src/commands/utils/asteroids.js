const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asteroids")
    .setDescription(
      "Retrieve a list of asteroids based on their closest approach date to Earth."
    )
    .addStringOption((option) =>
      option
        .setName("start_date")
        .setDescription("Start date for the search (YYYY-MM-DD)(max. 7 days⛔)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("end_date")
        .setDescription("End date for the search (YYYY-MM-DD)(max. 7 days⛔)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("api_key")
        .setDescription("Your NASA API key")
        .setRequired(false)
    ),

  async execute(interaction) {
    const startDate = interaction.options.getString("start_date");
    const endDate = interaction.options.getString("end_date");
    const apiKey = interaction.options.getString("api_key");

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      await interaction.reply("Invalid date format. Please use YYYY-MM-DD.");
      return;
    }

    const currentDate = new Date();

    if (
      new Date(startDate) > currentDate ||
      new Date(endDate) > currentDate ||
      new Date(startDate) > new Date(endDate)
    ) {
      await interaction.reply(
        "Invalid date range. Please ensure the start date is in the past and precedes the end date."
      );
      return;
    }

    const defaultApiKey = process.env.NASA_API;
    const usedApiKey = apiKey || defaultApiKey;

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${usedApiKey}`;

    try {
      const response = await axios.get(url);
      const asteroids = response.data.near_earth_objects;

      if (!asteroids || Object.keys(asteroids).length === 0) {
        await interaction.reply("No asteroids found for the specified dates.");
        return;
      }

      const totalAsteroids = Object.values(asteroids).reduce(
        (acc, curr) => acc + curr.length,
        0
      );
      let embedColor = "#00ff00";
      if (totalAsteroids < 10) {
        embedColor = "#ffff00";
      } else if (totalAsteroids >= 10 && totalAsteroids < 50) {
        embedColor = "#ffa500";
      } else {
        embedColor = "#ff0000";
      }

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle("🌌 Asteroids Closest Approach to Earth 🌌")
        .setDescription(
          `Here's a list of asteroids based on their closest approach to Earth between ${startDate} and ${endDate}: 🚀`
        )
        .setFooter({
          text:
            "Asteroid Report generated on " + new Date().toLocaleDateString(),
        });

      for (const date in asteroids) {
        const dateAsteroids = asteroids[date];
        embed.addFields({
          name: `📅 Date: ${date}`,
          value: `🪐 Number of asteroids: ${dateAsteroids.length}`,
        });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("Failed to retrieve asteroid data.");
    }
  },
};
