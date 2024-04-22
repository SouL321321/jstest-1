const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { Big } = require("big.js");


module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get weather forecast for a location☁")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Enter the location for weather forecast")
        .setRequired(true)
    ),
    async execute (interaction) {
    try {
      const location = interaction.options.getString("location");
      const apiKey = process.env.WEATHER_KEY;

      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

      const response = await axios.get(weatherApiUrl);
      const weatherData = response.data;
      const temperatureCelsius = new Big(weatherData.main.temp).minus(273.15);

      const weatherEmbed = {
        color: 0x0099ff,
        title: `Weather Forecast for ${weatherData.name}`,
        description: `Current Temperature: ${temperatureCelsius.toFixed(2)}°C`,
        fields: [
          {
            name: "Weather",
            value: weatherData.weather[0].description,
          },
          {
            name: "Humidity",
            value: `${weatherData.main.humidity}%`,
          },
          {
            name: "Wind Speed",
            value: `${weatherData.wind.speed} m/s`,
          },
        ],
      };
      await interaction.reply({ embeds: [weatherEmbed] });
    } catch (error) {
      console.error("Error getting weather forecast:", error);
      await interaction.reply(
        "Error getting weather forecast. Please try again later."
      );
    }
  },
};
