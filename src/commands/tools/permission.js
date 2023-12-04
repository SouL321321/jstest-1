const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("permission")
    .setDescription("This command requires permissions!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const { roles } = interaction.member;
    const role = await interaction.guild.roles
      .fetch("1180876848519987260")
      .catch(console.error);

    const testRole = await interaction.guild.roles
      .create({
        name: "Admin",
        color: 0xa020f0,
        permissions: [PermissionsBitField.Flags.KickMembers],
      })
      .catch(console.error);

    //Here u have the role
    if (roles.cache.has("1180876848519987260")) {
      await interaction.deferReply({
        fetchReply: true,
      });

      await roles.remove(role).catch(console.error);
      await interaction.editReply({
        content: `Removed: ${role.name} role from you.`,
      });
    } else {
      await interaction.reply({
        content: `You do not have the ${role.name} role.`,
      });
    }

    await roles.add(testRole).catch(console.error);

    await testRole
      .setPermissions([PermissionsBitField.Flags.BanMembers])
      .catch(console.error);

    await channel.permissionOverwrites
      .edit(testRole.id, { SendMessages: false })
      .catch(console.error);
  },
};
