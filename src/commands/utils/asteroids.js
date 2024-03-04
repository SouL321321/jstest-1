const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asteroids")
    .setDescription(
      "Retrieve information about asteroids based on their closest approach date to Earth."
    )
    .addStringOption((option) =>
      option
        .setName("start_date")
        .setDescription("Start date for asteroid search (YYYY-MM-DD)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("end_date")
        .setDescription("End date for asteroid search (YYYY-MM-DD)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const startDate = interaction.options.getString("start_date");
    const endDate = interaction.options.getString("end_date");
    const apiKey = process.env.NASA_API;

    try {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`
      );
      const asteroidData = response.data;

      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("Asteroid Information")
        .setDescription(
          `Asteroids approaching Earth between ${startDate} and ${endDate}:`
        );

      for (const date in asteroidData.near_earth_objects) {
        if (asteroidData.near_earth_objects.hasOwnProperty(date)) {
          const asteroids = asteroidData.near_earth_objects[date];
          for (const asteroid of asteroids) {
            embed.addFields(
              `Name: ${asteroid.name}`,
              `Approach Date: ${date}\nEstimated Diameter (km): ${asteroid.estimated_diameter.kilometers.estimated_diameter_min} - ${asteroid.estimated_diameter.kilometers.estimated_diameter_max}\nVelocity (km/h): ${asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour}`
            );
          }
        }
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching asteroid data:", error);
      await interaction.reply("Failed to retrieve asteroid data.");
    }
  },
};
