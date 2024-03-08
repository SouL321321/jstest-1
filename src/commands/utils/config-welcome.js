const { SlashCommandBuilder } = require("discord.js");
const GuildConfig = require("../../models/guildConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Configure bot welcome settings.")
    .addChannelOption((option) =>
      option
        .setName("welcome-channel")
        .setDescription("The welcome channel for the server.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("welcome-role")
        .setDescription("The welcome role for the server.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const welcomeChannel = interaction.options.getChannel("welcome-channel");
    const welcomeRole = interaction.options.getRole("welcome-role");

    try {
      const guildId = interaction.guild.id;
      const existingConfig = await GuildConfig.findOneAndUpdate({ guildId });

      if (existingConfig) {
        existingConfig.welcomeChannelId = welcomeChannel.id;
        existingConfig.welcomeRoleId = welcomeRole.id;
        await existingConfig.save();
      } else {
        await GuildConfig.create({
          guildId,
          welcomeChannelId: welcomeChannel.id,
          welcomeRoleId: welcomeRole.id,
        });
      }

      await interaction.reply("Configuration completed successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      await interaction.reply(
        "An error occurred while saving the configuration."
      );
    }
  },
};
