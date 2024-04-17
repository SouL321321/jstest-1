const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const developerIDs = ["567580659032391681", "540617704005042201"];
const usageCounts = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete a specified number of messages in the channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of messages to delete (max 50).")
        .setRequired(true)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const channel = interaction.channel;
    const authorID = interaction.user.id;

    if (
      !developerIDs.includes(authorID) &&
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "You don't have permission to delete messages.",
        ephemeral: true,
      });
    }

    if (!developerIDs.includes(authorID)) {
      const usageLimit = 5;
      const resetTime = 24 * 60 * 60 * 1000;
      const now = Date.now();

      if (!usageCounts.has(authorID)) {
        usageCounts.set(authorID, { count: 0, reset: now + resetTime });
      }

      const userUsage = usageCounts.get(authorID);
      if (now > userUsage.reset) {
        userUsage.count = 0;
        userUsage.reset = now + resetTime;
      }

      if (userUsage.count >= usageLimit) {
        return interaction.reply({
          content: "You have reached the daily usage limit for this command.",
          ephemeral: true,
        });
      }

      userUsage.count++;
    }

    if (amount <= 0 || amount > 50) {
      return interaction.reply({
        content: "Please specify a number between 1 and 50.",
        ephemeral: true,
      });
    }

    try {
      const messages = await channel.bulkDelete(amount, true);

      const deletedMessageCount = messages.size;

      const deleteEmbed = new EmbedBuilder()
        .setTitle("Messages Deleted")
        .setDescription(`Successfully deleted ${deletedMessageCount} messages.`)
        .setColor("#00ff00")
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      interaction.reply({ embeds: [deleteEmbed], ephemeral: false });
    } catch (error) {
      console.error("Error deleting messages:", error);

      const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setDescription("An error occurred while deleting messages.")
        .setColor("#ff0000");

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
