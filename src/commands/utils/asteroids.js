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
        .setDescription("Start date for the search (YYYY-MM-DD)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("end_date")
        .setDescription("End date for the search (YYYY-MM-DD)")
        .setRequired(false)
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

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const asteroids = response.data.near_earth_objects;

      if (!asteroids || Object.keys(asteroids).length === 0) {
        await interaction.reply("No asteroids found for the specified dates.");
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Asteroids Closest Approach to Earth")
        .setDescription(
          `A list of asteroids based on their closest approach date to Earth between ${startDate} and ${endDate}:`
        );

      for (const date in asteroids) {
        const dateAsteroids = asteroids[date];
        embed.addFields({
          name: `Date: ${date}`,
          value: `Number of asteroids: ${dateAsteroids.length}`,
        });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("Failed to retrieve asteroid data.");
    }
  },
};
