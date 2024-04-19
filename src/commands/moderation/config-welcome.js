const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../models/guildConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Configure bot welcome settings.")
    .addChannelOption((option) =>
      option
        .setName("welcome-channel")
        .setDescription(
          "The welcome channel for send the welcome embed in the server."
        )
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("welcome-role")
        .setDescription("The welcome role for the server.")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      await interaction.reply("Only administrators can use this command.");
      return;
    }

    const welcomeChannel = interaction.options.getChannel("welcome-channel");
    const welcomeRole = interaction.options.getRole("welcome-role");

    try {
      const guildId = interaction.guild.id;
      console.log(`Command received for guild ${guildId}`);

      if (!welcomeChannel) {
        throw new Error("Welcome channel not provided.");
      }

      const configUpdate = {
        $set: { welcomeChannelId: welcomeChannel.id },
      };

      if (welcomeRole) {
        configUpdate.$set.welcomeRoleId = welcomeRole.id;
      }

      const result = await GuildConfig.findOneAndUpdate(
        { guildId },
        configUpdate,
        { upsert: true, new: true }
      );

      if (!result) {
        throw new Error("Failed to save configuration.");
      }

      console.log(`Configuration saved for guild ${guildId}`);
      console.log("Result:", result);

      await interaction.reply("Configuration completed successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error.message);
      await interaction.reply(
        "An error occurred while saving the configuration. " + error.message
      );
    }
  },
};
