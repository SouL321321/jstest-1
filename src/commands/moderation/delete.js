const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

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
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "You don't have permission to delete messages.",
        ephemeral: true,
      });
    }

    if (amount <= 0 || amount > 50) {
      return interaction.reply({
        content: "Please specify a number between 1 and 50.",
        ephemeral: true,
      });
    }

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      interaction.reply({
        content: `Successfully deleted ${messages.size} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error deleting messages:", error);
      interaction.reply({
        content: "An error occurred while deleting messages.",
        ephemeral: true,
      });
    }
  },
};
