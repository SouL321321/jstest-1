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
    )
    .addStringOption((option) =>
      option
        .setName("start_date")
        .setDescription(
          "Start date of a date range for multiple APOD images (YYYY-MM-DD)"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("end_date")
        .setDescription(
          "End date of a date range for multiple APOD images (YYYY-MM-DD)"
        )
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Number of random APOD images to retrieve")
        .setRequired(false)
    ),

  async execute(interaction) {
    const date = interaction.options.getString("date");
    const startDate = interaction.options.getString("start_date");
    const endDate = interaction.options.getString("end_date");
    const count = interaction.options.getInteger("count");

    let url = "https://api.nasa.gov/planetary/apod";
    const apiKey = process.env.NASA_API;

    const queryParams = [];

    if (date) {
      queryParams.push(`date=${date}`);
    } else if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`, `end_date=${endDate}`);
    } else if (count) {
      queryParams.push(`count=${count}`);
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

      if (Array.isArray(data)) {
        const embed = new EmbedBuilder()
          .setColor("#007bff")
          .setTitle("Astronomy Pictures of the Day")
          .setDescription(`Retrieved ${data.length} APOD images:`);

        data.forEach((apod) => {
          embed.addFields({
            name: apod.title,
            value: apod.explanation,
          });
          embed.setImage(apod.url);
        });

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor("#007bff")
          .setTitle("Astronomy Picture of the Day")
          .setDescription(data.explanation)
          .setImage(data.url);

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Failed to retrieve Astronomy Picture of the Day."
      );
    }
  },
};
