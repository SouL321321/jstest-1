const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const FeedbackModel = require("../../models/feedback");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-feedback")
    .setDescription("Send feedback to the administrators.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your feedback message.")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const guildId = interaction.guild.id;
      const feedbackMessage = interaction.options.getString("message");

      const newFeedback = new FeedbackModel({
        userId,
        guildId,
        message: feedbackMessage,
        timestamp: new Date(),
      });

      await newFeedback.save();

      await interaction.reply("Feedback sent successfully!");
    } catch (error) {
      console.error("Error sending feedback:", error);
      await interaction.reply(
        "An error occurred while sending feedback. Please try again later."
      );
    }
  },
};
