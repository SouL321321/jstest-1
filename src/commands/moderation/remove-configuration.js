const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../models/guildConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-configuration")
    .setDescription("Remove bot welcome settings configuration."),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      await interaction.reply("Only administrators can use this command.");
      return;
    }

    try {
      const guildId = interaction.guild.id;
      console.log(`Remove configuration command received for guild ${guildId}`);

      const result = await GuildConfig.findOneAndDelete({ guildId });

      if (!result) {
        throw new Error("No configuration found to remove.");
      }

      console.log(`Configuration removed for guild ${guildId}`);
      console.log("Result:", result);

      await interaction.reply("Configuration removed successfully!");
    } catch (error) {
      console.error("Error removing configuration:", error.message);
      await interaction.reply(
        "An error occurred while removing the configuration. " + error.message
      );
    }
  },
};
