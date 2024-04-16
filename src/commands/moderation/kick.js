const { SlashCommandBuilder } = require("discord.js");

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
      return interaction.reply(`You don't have permission to kick members!`);
    }

    if (
      target.roles.highest.comparePositionTo(
        interaction.member.roles.highest
      ) >= 0
    ) {
      return interaction.reply(
        "You cannot kick a user with the same or higher role than yours."
      );
    }
    try {
      await interaction.guild.members.kick(
        target,
        interaction.options.getString("reason") || "No reason specified"
      );
      interaction.reply(
        `Successfully kicked ✔ ${target.username} for the next reason: ${reason}. ✅`
      );
    } catch (error) {
      console.error(`Error occurred while kicking user: ${error}`);
      interaction.reply(`An error occurred while kickin the user.`);
    }
  },
};  