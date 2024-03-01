const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("earthquake")
    .setDescription("Get information about recent earthquakes")
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription("The country to filter earthquakes by")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const country = interaction.options.getString("country");

      let url =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
      if (country) {
        url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson?country=${country}`;
      }

      const fetch = await import("node-fetch");
      const response = await fetch.default(url);
      const data = await response.json();

      const earthquake = data.features[0];

      const embed = new EmbedBuilder()
        .setTitle("Recent Earthquake")
        .addFields("Location", earthquake.properties.place)
        .addFields("Magnitude", earthquake.properties.mag)
        .addFields("Time", new Date(earthquake.properties.time).toUTCString())
        .setColor("#ff0000")
        .setFooter("Data provided by USGS");

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      interaction.reply(
        "Sorry, there was an error while fetching earthquake data."
      );
    }
  },
};
