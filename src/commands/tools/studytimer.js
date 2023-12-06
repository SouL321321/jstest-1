const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("studytimer")
    .setDescription("Set a timer for your study session")
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("Number of minutes for the study session")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, user } = interaction;
    const studyMinutes = options.getInteger("minutes");

    if (studyMinutes > 0) {
      const studyTime = studyMinutes * 60 * 1000;

      await interaction.reply("Your study timer has started! 📚⏲️");

      setTimeout(async () => {
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
      }, studyTime);
    } else {
      await interaction.reply(
        "Please provide a valid duration for the study session."
      );
    }
  },
};
