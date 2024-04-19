const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("planetary")
    .setDescription(
      "Retrieve the Astronomy Picture of the Day (APOD) from NASA."
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date of the APOD image to retrieve (YYYY-MM-DD)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const date = interaction.options.getString("date");

    let url = "https://api.nasa.gov/planetary/apod";
    const apiKey = process.env.NASA_API;

    const queryParams = [];

    if (date) {
      queryParams.push(`date=${date}`);
    }

    queryParams.push(`api_key=${apiKey}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    try {
      const response = await axios.get(url);

      const rateLimitRemaining = response.headers["x-ratelimit-remaining"];
      const rateLimitReset = response.headers["x-ratelimit-reset"];
      let replyMessage = "Retrieved Astronomy Picture of the Day.";
      if (rateLimitRemaining !== undefined && rateLimitReset !== undefined) {
        replyMessage += `\nRate limit remaining: ${rateLimitRemaining}`;
        replyMessage += `\nRate limit reset time: ${new Date(
          rateLimitReset * 1000
        )}`;
      }

      const data = response.data;

      if (data.url) {
        const embed = new EmbedBuilder()
          .setColor("#007bff")
          .setTitle("Astronomy Picture of the Day")
          .setDescription(data.explanation)
          .setImage(data.url, { size: 1024 });

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply("No image found for the specified date.");
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Failed to retrieve Astronomy Picture of the Day."
      );
    }
  },
};
