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

      const embed = new EmbedBuilder()
        .setTitle("Latest Earthquakes")
        .setColor(parseInt("FF0000", 16));

      earthquakes.forEach((quake) => {
        const timeString = `<t:${Math.round(quake.properties.time / 1000)}:R>`;
        embed.addFields({
          name: `${quake.properties.place}`,
          value: `Magnitude ${quake.properties.mag} (${quake.properties.magType}) - ${quake.properties.place}\n**Time:** ${timeString} (UTC)\nDepth: ${quake.geometry.coordinates[2]}km`,
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
