const axios = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const moment = require("moment-timezone");

let isTimerActive = false;

function isValidTimeFormat(timeString) {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeString);
}

function isValidSubject(subject) {
  return /^[a-zA-Z0-9\s]+$/.test(subject);
}

async function getUtcOffset(location) {
  try {
    if (!location) return 0;

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    );

    if (response.data.length === 0) {
      throw new Error("Location not found");
    }

    const firstMatch = response.data[0];

    const timezone = firstMatch.timezone;

    const utcOffset = moment.tz(timezone).utcOffset();

    return utcOffset;
  } catch (error) {
    console.error("Error getting UTC offset:", error);
    return null;
  }
}

async function getRandomImage() {
  try {
    const unsplashApiKey = process.env.UNSPLASH_API;
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query: "random",
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${unsplashApiKey}`,
      },
    });
    return response.data.urls.regular;
  } catch (error) {
    console.error("Error retrieving random image from Unsplash:", error);
    return null;
  }
}

module.exports = {
  countdown: true,
  data: new SlashCommandBuilder()
    .setName("study-timer")
    .setDescription("Start a study timer (UTC time🕐)")
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "Duration of study time in minutes (How much time you want study?👀)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("subject")
        .setDescription("Subject to study")
        .setRequired(true)
        .addChoices(
          { name: "Math", value: "math" },
          { name: "Science", value: "science" },
          { name: "History", value: "history" },
          { name: "Geography", value: "geography" },
          { name: "Language Arts", value: "language arts" },
          { name: "Physical Education", value: "physical education" },
          { name: "Art", value: "art" },
          { name: "Music", value: "music" },
          { name: "Foreign Languages", value: "foreign languages" },
          { name: "Computer Science", value: "computer science" },
          { name: "Other", value: "other" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("start-time")
        .setDescription(
          "Time to start studying in HH:MM format (24-hour clock)"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Your location (It can give errors...)")
    ),

  async execute(interaction) {
    try {
      if (isTimerActive) {
        return await interaction.reply({
          content:
            "You already have an active study timer. Please wait for it to finish.",
          ephemeral: true,
        });
      }

      const duration = interaction.options.getInteger("duration");
      const subject = interaction.options.getString("subject");
      const startTime = interaction.options.getString("start-time");
      const location = interaction.options.getString("location");

      if (!Number.isInteger(duration) || duration <= 0) {
        return await interaction.reply({
          content: "Please provide a valid positive integer for the duration.",
          ephemeral: true,
        });
      }

      if (!isValidSubject(subject)) {
        return await interaction.reply({
          content: "Please provide a valid subject to study.",
          ephemeral: true,
        });
      }

      if (!isValidTimeFormat(startTime)) {
        return await interaction.reply({
          content: "Please provide a valid start time in HH:MM format.",
          ephemeral: true,
        });
      }

      const unsplashApiKey = process.env.UNSPLASH_API;
      const imageUrl = await getRandomImage(unsplashApiKey);

      const utcOffset = await getUtcOffset(location);

      if (utcOffset === null) {
        return await interaction.reply({
          content: "Error getting UTC offset.",
          ephemeral: true,
        });
      }

      const currentTime = moment.utc();
      const startDateTime = moment.tz(startTime, "HH:mm", "Europe/Rome").utc();
      const timeDifference = startDateTime.diff(currentTime);

      if (timeDifference <= 0) {
        return await interaction.reply({
          content: "Please provide a start time in the future.",
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("📚 Study Timer 🕒")
        .setColor("#4caf50")
        .setDescription(
          `**Subject:** ${subject}\n**Duration:** ${duration} minutes\n**Start Time:** ${startDateTime.format(
            "HH:mm"
          )}\n\nIt's time to start studying for ${duration} minutes! Wait the bot that will msg you`
        )
        .setImage(imageUrl)
        .setTimestamp();

      const reply = await interaction.reply({
        embeds: [embed],
      });

      isTimerActive = true;

      const delayUntilEnd =
        startDateTime.valueOf() + duration * 60 * 1000 - currentTime.valueOf();

      setTimeout(async () => {
        interaction.user.send(`It's time to start studying! 📚`);
      }, delayUntilEnd);

      setTimeout(async () => {
        const updatedEmbed = new EmbedBuilder()
          .setTitle("📚 Study Timer 🕒")
          .setColor("#ff0000")
          .setDescription(
            `**Subject:** ${subject}\n**Duration:** ${duration} minutes\n**Start Time:** ${startDateTime.format(
              "HH:mm"
            )}\n\nStudy time is over! Go back to play!`
          )
          .setTimestamp();

        const messageOptions = { embeds: [updatedEmbed], ephemeral: true };

        await reply.edit(messageOptions);
        await interaction.user.send({
          content: "Study time is over! 🎉",
          ephemeral: true,
        });

        isTimerActive = false;
      }, delayUntilEnd);

      setTimeout(async () => {
        interaction.user.send(`It's time to start studying! 📚`);
      }, timeDifference);
    } catch (error) {
      console.error("Error starting study timer:", error);
      await interaction.reply(
        "An error occurred while starting the study timer."
      );
    }
  },
};
