const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("asteroids")
    .setDescription(
      "Retrieve a list of asteroids based on their closest approach date to Earth. 🌍"
    ),
  async execute(interaction) {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${currentDate}&end_date=${currentDate}&api_key=DEMO_KEY`
      );

      const asteroids = response.data.near_earth_objects[currentDate];

      const asteroidEmbed = new EmbedBuilder()
        .setTitle("🌌 Asteroids Closest Approach to Earth 🌌")
        .setDescription(`List of asteroids approaching Earth today:`)
        .setColor("#F7931E");

      let asteroidCount = 0;

      if (asteroids) {
        asteroids.forEach((asteroid, index) => {
          if (asteroidCount < 15) {
            asteroidEmbed.addFields({
              name: `**Name:**              `,
              value: `**${asteroid.name}**\n*Closet Approach Date:**  ${asteroid.close_approach_data[0].close_approach_date_full}\n**Relative Velocity (km/h):** ${asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour}\n**Miss Distance (kilometers):** ${asteroid.close_approach_data[0].miss_distance.kilometers}`,
              inline: true,
            });
            asteroidCount++;
          }
        });
      }

      await interaction.reply({ embeds: [asteroidEmbed], ephemeral: false });
    } catch (error) {
      console.error("Error executing 'asteroids' command:", error);
      await interaction.reply({
        content:
          "An error occurred while processing your command. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
