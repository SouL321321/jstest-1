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

      // Check if feedback channel exists, create one if not
      let feedbackChannel = interaction.guild.channels.cache.find(
        (channel) =>
          channel.type === "GUILD_TEXT" &&
          channel.name.toLowerCase() === "feedback"
      );

      if (!feedbackChannel) {
        feedbackChannel = await interaction.guild.channels.create("feedback", {
          type: "GUILD_TEXT",
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: ["ADMINISTRATOR"],
            },
          ],
        });
      }

      // Send feedback message to the feedback channel
      await feedbackChannel.send({
        content: `New feedback from <@${userId}>:`,
        embeds: [
          new EmbedBuilder()
            .setDescription(feedbackMessage)
            .setColor("#00ff00")
            .setTimestamp()
            .setFooter(`User ID: ${userId}`)
            .toJSON(),
        ],
      });

      await interaction.reply("Feedback sent successfully!");
    } catch (error) {
      console.error("Error sending feedback:", error);
      await interaction.reply(
        "An error occurred while sending feedback. Please try again later."
      );
    }
  },
};
