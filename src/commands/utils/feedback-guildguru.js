const { SlashCommandBuilder } = require("discord.js");
const BotFeedbackModel = require("../../models/bot-feedack");

const developers = process.env.DEVELOPERS_ID.split(",");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback-guildguru")
    .setDescription("Send feedback to the developers [Any feedback is accepted. ✅].")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your feedback message.")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const message = interaction.options.getString("message");
      const guildId = interaction.guild.id;

      if (!developers.includes(userId)) {
        const today = new Date().setHours(0, 0, 0, 0);
        const userFeedbackToday = await BotFeedbackModel.find({
          userId,
          timestamp: { $gte: today },
        });

        if (userFeedbackToday.length >= 2) {
          await interaction.reply(
            "You have already sent the maximum number of feedbacks today. Try again tomorrow!"
          );
          return;
        }
      }

      const feedback = new BotFeedbackModel({ userId, message, guildId });
      await feedback.save();

      for (const developerId of developers) {
        try {
          const developer = await interaction.client.users.fetch(developerId);
          await developer.send(
            `New feedback from ${interaction.user.tag} in the server ${interaction.guild.name}:\n${message}`
          );
        } catch (fetchError) {
          console.error(
            `Could not send feedback to developer ${developerId}:`,
            fetchError
          );
        }
      }

      await interaction.reply("Feedback sent successfully to the developers!");
    } catch (error) {
      console.error("Error sending feedback:", error);
      await interaction.reply(
        "An error occurred while sending the feedback. Please try again later."
      );
    }
  },
};
