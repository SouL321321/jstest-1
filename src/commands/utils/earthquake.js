const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
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

      const quakeLines = earthquakes.map((quake) => {
        const timeString = <t:${Math.round(quake.properties.time / 1000)}:R>;
        return **${quake.properties.place}** - **Mag:** \${quake.properties.mag}` | ${timeString} | Depth: `${quake.geometry.coordinates[2]}km``;
      });

      const quakeText = quakeLines.join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle("🌍 Latest Earthquakes 🌍")
        .setColor(0xFF0000)
        .setDescription("⚠️ Showing recent earthquakes ⚠️")
        .addFields({
          name: "Recent Earthquakes",
          value: quakeText.substring(0, 1024),
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