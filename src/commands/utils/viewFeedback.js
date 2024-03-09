const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const FeedbackModel = require("../../models/feedback");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view-feedback")
    .setDescription(
      "View all feedback messages. ⚠️ Just For Administrators! ⚠️"
    ),

  async execute(interaction) {
    try {
      if (interaction.member.permissions.has("ADMINISTRATOR")) {
        const guildId = interaction.guild.id;

        const allFeedback = await FeedbackModel.find({ guildId });

        const feedbackList = allFeedback.map((feedback, index) => {
          const embed = new EmbedBuilder()
            .setTitle(`Feedback #${index + 1}`)
            .addFields([
              { name: "User", value: `<@${feedback.userId}>`, inline: true },
              { name: "Message", value: feedback.message, inline: true },
              {
                name: "Timestamp",
                value: feedback.timestamp.toLocaleString(),
                inline: true,
              },
            ])
            .setColor("#7289DA")
            .setFooter({ text: "Feedback Viewer" });

          return embed;
        });

        if (feedbackList.length > 0) {
          await interaction.reply({ embeds: feedbackList });
        } else {
          await interaction.reply("No feedback messages available.");
        }
      } else {
        await interaction.reply(
          "You don't have permission to use this command."
        );
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      await interaction.reply(
        "An error occurred while fetching feedback. Please try again later."
      );
    }
  },
};
