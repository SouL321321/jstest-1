const { SlashCommandBuilder } = require("discord.js");
const FeedbackModel = require("../../models/feedback");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Send feedback to the development team for increase our server.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your feedback")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("Your nickname")
    ),

  async execute(interaction) {
    const feedbackMessage = interaction.options.getString("message");
    const userId = interaction.user.id;
    const nickname = interaction.options.getString("nickname");

    try {
      // Check if the user has already submitted feedback in the last 24 hours
      const isAdmin = interaction.member.permissions.has("ADMINISTRATOR");

      if (!isAdmin) {
        const lastFeedback = await FeedbackModel.findOne({
          userId: userId,
          timestamp: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) },
        });

        if (lastFeedback) {
          return await interaction.reply(
            "You can submit only one feedback per day. Please try again tomorrow!"
          );
        }
      }

      await FeedbackModel.create({ userId, nickname, message: feedbackMessage });

      await interaction.reply(
        "Your feedback has been successfully sent! Thank you for your contribution."
      );
    } catch (error) {
      console.error("Error sending feedback:", error);
      await interaction.reply(
        "An error occurred while sending feedback. Please try again later."
      );
    }
  },
};
