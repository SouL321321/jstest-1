const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const FeedbackModel = require("../../models/feedback");
const developers = process.env.DEVELOPERS_ID;

async function countFeedbacksToday(userId) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const count = await FeedbackModel.countDocuments({
    userId,
    timestamp: { $gte: startOfToday, $lte: endOfToday },
  });

  return count;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-feedback")
    .setDescription("Send feedback to the administrators. (Max 3 per day.)")
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

      const feedbackCount = await countFeedbacksToday(userId);
      if (feedbackCount >= 3 && !developers.includes(userId)) {
        return await interaction.reply(
          "You have reached the daily feedback limit."
        );
      }

      const newFeedback = new FeedbackModel({
        userId,
        guildId,
        message: feedbackMessage,
        timestamp: new Date(),
      });
      await newFeedback.save();

      let feedbackChannel = interaction.guild.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildText &&
          channel.name.toLowerCase().startsWith("feedback-") &&
          channel.topic === interaction.user.id
      );

      if (!feedbackChannel) {
        const user = await interaction.client.users.fetch(interaction.user.id);
        const userName = user.username.replace(/\s+/g, "-");

        feedbackChannel = await interaction.guild.channels.create({
          name: `feedback-${userName}`,
          topic: interaction.user.id,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ViewChannel,
              ],
            },
            {
              id: interaction.client.user.id,
              allow: [
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ViewChannel,
              ],
            },
          ],
        });
      }

      await feedbackChannel.send({
        content: `New feedback from <@${userId}>:`,
        embeds: [
          new EmbedBuilder()
            .setDescription(feedbackMessage)
            .setColor("#00ff00")
            .setTimestamp()
            .setFooter({
              text: `User ID: ${userId}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .toJSON(),
        ],
      });

      await interaction.reply({
        content: "Feedback sent successfully!",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error sending feedback:", error);
      await interaction.reply(
        "An error occurred while sending feedback. Please try again later."
      );
    }
  },
};
