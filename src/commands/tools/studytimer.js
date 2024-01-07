const { SlashCommandBuilder } = require("discord.js");
const moment = require("moment-timezone");

const POMODORO_WORK_TIME = 25 * 60 * 1000; // 25 min
const POMODORO_BREAK_TIME = 5 * 60 * 1000; // 5 min

const userStudyStats = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("studytimer")
    .setDescription("Set a timer for your study session")
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("Number of minutes for the study session")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Choose Pomodoro mode if you want short breaks")
        .setRequired(false)
        .addChoices({ name: "Pomodoro", value: "pomodoro" })
        .addChoices({ name: "Regular", value: "regular" })
    ),

    async execute (interaction) {
    const { options, user, guild } = interaction;
    const studyMinutes = options.getInteger("minutes");
    const mode = options.getString("mode") || "regular";

    if (studyMinutes > 0) {
      const studyTime = studyMinutes * 60 * 1000;

      const endStudySession = async () => {
        await interaction.editReply("Your study session is over! 📚✨");

        try {
          await user.send("Your study session is over! 📚✨");
        } catch (error) {
          console.error(
            `Failed to send study session completion message: ${error.message}`
          );
        }

        await interaction.followUp(
          `Great job ${user.toString()}! Take a break and come back refreshed.`
        );


        const userTimezone = "Europe/Rome";
        const currentTime = moment().tz(userTimezone);
        const dateKey = currentTime.format("YYYY-MM-DD");

        if (!userStudyStats[guild.id]) {
          userStudyStats[guild.id] = {};
        }

        if (!userStudyStats[guild.id][user.id]) {
          userStudyStats[guild.id][user.id] = {};
        }

        if (!userStudyStats[guild.id][user.id][dateKey]) {
          userStudyStats[guild.id][user.id][dateKey] = 0;
        }

        userStudyStats[guild.id][user.id][dateKey] += studyMinutes;
      };

      await interaction.reply(
        `Your study timer has started! 📚⏲️\nMode: ${
          mode === "pomodoro" ? "Pomodoro" : "Regular"
        }`
      );

      if (mode === "pomodoro") {
        setTimeout(async () => {
          await interaction.followUp("Pomodoro work session is over! 🍅📚");

          setTimeout(endStudySession, POMODORO_BREAK_TIME);
        }, POMODORO_WORK_TIME);
      } else {
        setTimeout(endStudySession, studyTime);
      }
    } else {
      await interaction.reply(
        "Please provide a valid duration for the study session."
      );
    }
  },
};
