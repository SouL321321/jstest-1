const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("User to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for ban")
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");

    if (!interaction.memberPermissions.has("BAN_MEMBERS")) {
      return interaction.reply(`No permissions for ban!`);
    }

    try {
      const targetMember = await interaction.guild.members.fetch(targetUser);

      await targetMember.ban({
        reason:
          interaction.options.getString("reason") || "No reason specified",
      });

      interaction.reply(
        `Successfully banned ${targetUser.username} for ${reason}`
      );
    } catch (error) {
      console.error(`Error occurred while banning user: ${error}`);
      interaction.reply(`An error occurred while banning the user.`);
    }
  },
};
