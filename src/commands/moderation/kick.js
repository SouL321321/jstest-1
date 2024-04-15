const { SlashCommandBuilder } = require("discord.js");
const KickBan = require("../../models/KickBan");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to kick").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kick")
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    if (!interaction.memberPermissions.has("KICK_MEMBERS")) {
      return interaction.reply("You do not have permission to kick members.");
    }

    try {
      await interaction.guild.members.kick(target, reason);

      await KickBan.create({
        userId: target.id,
        guildId: interaction.guild.id,
        action: "kick",
        reason,
      });

      interaction.reply(`Successfully kicked ${target.tag}.`);
    } catch (error) {
      console.error("Error occurred while kicking user:", error);
      interaction.reply("An error occurred while kicking the user.");
    }
  },
};
