const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("earthquake")
    .setDescription("Retrieve earthquake data from USGS"),

  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://earthquake.usgs.gov/fdsnws/event/1/query",
        {
          params: {
            format: "geojson",
            limit: 10,
            minmagnitude: 2,
          },
        }
      );

      const earthquakes = response.data.features;

      const embed = new EmbedBuilder()
        .setTitle("🌍 Latest Earthquakes 🌍")
        .setColor(0xff0000)
        .setDescription("⚠️ **Showing recent earthquakes** ⚠️");

      earthquakes.forEach((quake) => {
        const date = new Date(quake.properties.time);
        const timeString = `<t:${Math.round(date.getTime() / 1000)}:R>`;
        const mapUrl = `https://earthquake.usgs.gov/earthquakes/eventpage/${quake.id}/map`;

        embed.addFields({
          name: `**${quake.properties.place}**`,
          value: `Magnitude ${quake.properties.mag} (${quake.properties.magType})\nTime: ${timeString} (UTC)\nDepth: ${quake.geometry.coordinates[2]}km\n[View on Map](${mapUrl})`,
        });
      });

      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      await interaction.reply(
        "An error occurred while fetching earthquake data."
      );
    }
  },
};
